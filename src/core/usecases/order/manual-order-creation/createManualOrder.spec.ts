import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { DeliveryStatus } from '@core/entities/delivery'
import {
  Address,
  Contact,
  CustomerOrder,
  OrderLineStatus,
  PaymentStatus
} from '@core/entities/order'
import {
  CreateManualOrderDTO,
  createManualOrder,
  ManualOrderPaymentMode
} from '@core/usecases/order/manual-order-creation/createManualOrder'
import { useOrderStore } from '@store/orderStore'
import { addTaxToPrice } from '@utils/price'
import { elodieDurand } from '@utils/testData/customers'
import { clickAndCollect, express } from '@utils/testData/deliveryMethods'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Create manual order', () => {
  let orderGateway: InMemoryOrderGateway
  let orderStore: ReturnType<typeof useOrderStore>
  const uuidGenerator = new FakeUuidGenerator()
  const dateProvider = new FakeDateProvider()
  const NOW = 1740000000000
  const uuid = 'created-order-uuid'
  const DELIVERY_TAX_RATE = 20

  const address: Address = {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '12 rue des Lilas',
    city: 'Alès',
    zip: '30100',
    country: 'France'
  }
  const contact: Contact = {
    email: elodieDurand.email,
    phone: elodieDurand.phone
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    orderGateway = new InMemoryOrderGateway(dateProvider, uuidGenerator)
    orderGateway.feedWithProducts(dolodent, ultraLevure)
    orderGateway.feedWithDeliveryMethods(clickAndCollect, express)
    orderStore = useOrderStore()
    dateProvider.feedWith(NOW)
    uuidGenerator.setNext(uuid)
  })

  describe('Create a click and collect order for a customer', () => {
    const dto: CreateManualOrderDTO = {
      customerUuid: elodieDurand.uuid,
      lines: [
        { productUuid: dolodent.uuid, quantity: 1 },
        {
          productUuid: ultraLevure.uuid,
          quantity: ultraLevure.maxQuantityForOrder!
        }
      ],
      deliveryMethodUuid: clickAndCollect.uuid,
      deliveryAddress: address,
      billingAddress: address,
      contact,
      sendConfirmationEmail: false
    }
    const expectedOrder: CustomerOrder = {
      uuid,
      customerUuid: elodieDurand.uuid,
      lines: [
        {
          productUuid: dolodent.uuid,
          name: dolodent.name,
          ean13: dolodent.ean13,
          unitAmount: dolodent.priceWithoutTax,
          expectedQuantity: 1,
          preparedQuantity: 0,
          locations: dolodent.locations,
          percentTaxRate: dolodent.percentTaxRate,
          status: OrderLineStatus.Created,
          updatedAt: NOW
        },
        {
          productUuid: ultraLevure.uuid,
          name: ultraLevure.name,
          ean13: ultraLevure.ean13,
          unitAmount: ultraLevure.priceWithoutTax,
          expectedQuantity: ultraLevure.maxQuantityForOrder!,
          preparedQuantity: 0,
          locations: ultraLevure.locations,
          percentTaxRate: ultraLevure.percentTaxRate,
          status: OrderLineStatus.Created,
          updatedAt: NOW
        }
      ],
      deliveryAddress: address,
      billingAddress: address,
      payment: {
        status: PaymentStatus.Payed,
        amount:
          Math.round(
            addTaxToPrice(dolodent.priceWithoutTax, dolodent.percentTaxRate)
          ) +
          Math.round(
            addTaxToPrice(
              ultraLevure.priceWithoutTax,
              ultraLevure.percentTaxRate
            )
          ) *
            ultraLevure.maxQuantityForOrder!
      },
      createdAt: NOW,
      deliveries: [
        {
          uuid,
          price: 0,
          method: clickAndCollect,
          weight:
            dolodent.weight +
            ultraLevure.weight * ultraLevure.maxQuantityForOrder!,
          sender: { contact, address },
          receiver: { contact, address },
          status: DeliveryStatus.Created
        }
      ],
      messages: []
    }

    beforeEach(async () => {
      await whenCreateManualOrder(dto)
    })

    it('should save the order in the gateway', async () => {
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
    })

    it('should set the created order as current order', () => {
      expect(orderStore.current).toStrictEqual(expectedOrder)
    })
  })

  describe('Create a delivered order for a customer', () => {
    const dto: CreateManualOrderDTO = {
      customerUuid: elodieDurand.uuid,
      lines: [{ productUuid: dolodent.uuid, quantity: 1 }],
      deliveryMethodUuid: express.uuid,
      deliveryAddress: address,
      billingAddress: address,
      contact,
      sendConfirmationEmail: false
    }
    const expectedDeliveryPrice = express.priceRanges.FRANCE[1].price
    const expectedOrder: CustomerOrder = {
      uuid,
      customerUuid: elodieDurand.uuid,
      lines: [
        {
          productUuid: dolodent.uuid,
          name: dolodent.name,
          ean13: dolodent.ean13,
          unitAmount: dolodent.priceWithoutTax,
          expectedQuantity: 1,
          preparedQuantity: 0,
          locations: dolodent.locations,
          percentTaxRate: dolodent.percentTaxRate,
          status: OrderLineStatus.Created,
          updatedAt: NOW
        }
      ],
      deliveryAddress: address,
      billingAddress: address,
      payment: {
        status: PaymentStatus.Payed,
        amount:
          Math.round(
            addTaxToPrice(dolodent.priceWithoutTax, dolodent.percentTaxRate)
          ) +
          Math.round(addTaxToPrice(expectedDeliveryPrice, DELIVERY_TAX_RATE))
      },
      createdAt: NOW,
      deliveries: [
        {
          uuid,
          price: expectedDeliveryPrice,
          method: express,
          weight: dolodent.weight,
          sender: { contact, address },
          receiver: { contact, address },
          status: DeliveryStatus.Created
        }
      ],
      messages: []
    }

    beforeEach(async () => {
      await whenCreateManualOrder(dto)
    })

    it('should save the order with the delivery priced for the country', async () => {
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
    })
  })

  describe('Create an order awaiting payment on the payment page', () => {
    const dto: CreateManualOrderDTO = {
      customerUuid: elodieDurand.uuid,
      lines: [{ productUuid: dolodent.uuid, quantity: 1 }],
      deliveryMethodUuid: clickAndCollect.uuid,
      deliveryAddress: address,
      billingAddress: address,
      contact,
      sendConfirmationEmail: false,
      paymentMode: ManualOrderPaymentMode.PaymentPage
    }

    beforeEach(async () => {
      await whenCreateManualOrder(dto)
    })

    it('should save the order with a payment waiting to be payed and its payment page url', async () => {
      expect((await orderGateway.list())[0].payment).toStrictEqual({
        status: PaymentStatus.WaitingForPayment,
        amount: Math.round(
          addTaxToPrice(dolodent.priceWithoutTax, dolodent.percentTaxRate)
        ),
        paymentPageUrl: `https://payment.example/${uuid}`
      })
    })

    it('should expose the payment page url on the current order', () => {
      expect(orderStore.current!.payment!.paymentPageUrl).toStrictEqual(
        `https://payment.example/${uuid}`
      )
    })
  })

  describe('Create an order whose payment link is sent to the customer', () => {
    const dto: CreateManualOrderDTO = {
      customerUuid: elodieDurand.uuid,
      lines: [{ productUuid: dolodent.uuid, quantity: 1 }],
      deliveryMethodUuid: clickAndCollect.uuid,
      deliveryAddress: address,
      billingAddress: address,
      contact,
      sendConfirmationEmail: false,
      paymentMode: ManualOrderPaymentMode.PaymentLink
    }

    beforeEach(async () => {
      await whenCreateManualOrder(dto)
    })

    it('should save the order with a payment waiting to be payed and no payment page url', async () => {
      expect((await orderGateway.list())[0].payment).toStrictEqual({
        status: PaymentStatus.WaitingForPayment,
        amount: Math.round(
          addTaxToPrice(dolodent.priceWithoutTax, dolodent.percentTaxRate)
        )
      })
    })
  })

  const whenCreateManualOrder = async (dto: CreateManualOrderDTO) => {
    await createManualOrder(dto, orderGateway)
  }
})
