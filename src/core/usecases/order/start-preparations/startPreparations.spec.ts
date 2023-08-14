import { createPinia, setActivePinia } from 'pinia'
import { InMemoryOrderGateway } from '@adapters/secondary/InMemoryOrderGateway'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { DeliveryStatus, Order, OrderLine } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { startPreparations } from '@core/usecases/order/start-preparations/startPreparations'
import { usePreparationStore } from '@store/preparationStore'
import { FakeDateProvider } from '@adapters/secondary/FakeDateProvider'
import {
  EmailMessage,
  PreparationStartedMessage
} from '@core/entities/emailMessage'
import { FakeEmailGateway } from '@adapters/secondary/FakeEmailGateway'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { InMemoryProductGateway } from '@adapters/secondary/InMemoryProductGateway'
import { useProductStore } from '@store/productStore'

describe('Start preparations', () => {
  let orderGateway: InMemoryOrderGateway
  let productGateway: InMemoryProductGateway
  let emailGateway: FakeEmailGateway
  let preparationStore: any
  let productStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
    productGateway = new InMemoryProductGateway()
    emailGateway = new FakeEmailGateway()
    preparationStore = usePreparationStore()
    productStore = useProductStore()
  })

  describe('Existing orders', () => {
    const expectedOrder1 = JSON.parse(JSON.stringify(orderToPrepare1))
    expectedOrder1.lines.forEach(
      (l: OrderLine) => (l.deliveryStatus = DeliveryStatus.Processing)
    )
    const expectedOrder2 = JSON.parse(JSON.stringify(orderToPrepare2))
    expectedOrder2.lines.forEach(
      (l: OrderLine) => (l.deliveryStatus = DeliveryStatus.Processing)
    )
    beforeEach(() => {
      givenThereIsOrdersToPrepare(orderToPrepare1, orderToPrepare2)
      givenThereIsExistingProducts(dolodent, ultraLevure)
    })
    describe('Prepare all orders', () => {
      beforeEach(async () => {
        await whenStartPreparationForOrders(
          orderToPrepare1.uuid,
          orderToPrepare2.uuid
        )
      })
      it('should set each order line to processing', async () => {
        await expectOrdersToEqual(expectedOrder1, expectedOrder2)
      })
      it('should update preparation store', () => {
        expectPreparationStoreToEqual(expectedOrder1, expectedOrder2)
      })
      it('should clear selection', () => {
        expectSelectionToBeEmpty()
      })
      it('should send an email to each customer', () => {
        const expectedEmails: Array<PreparationStartedMessage> = [
          {
            to: 'jeanbon@anotheremail.com',
            shippingAddress: {
              firstname: 'Jean',
              lastname: 'Bon',
              address: '10 rue des peupliers, 12345, PlopLand',
              phone: '0123456789',
              link: ''
            },
            billingAddress: {
              firstname: 'Jean',
              lastname: 'Bon',
              address: '10 rue des peupliers, 12345, PlopLand',
              phone: '0123456789'
            },
            lines: [
              {
                img: dolodent.img,
                name: dolodent.name,
                unitPrice: '5,50\u00A0€',
                quantity: 2,
                total: '11,00\u00A0€'
              }
            ],
            totals: {
              productPrice: '11,00\u00A0€',
              shippingPrice: 'Gratuit',
              price: '11,00\u00A0€'
            }
          },
          {
            to: 'jeannedarc@email.com',
            shippingAddress: {
              firstname: 'Jeanne',
              lastname: "D'arc",
              address: '12 avenue du bois, 54321, Boisville',
              phone: '9876543210',
              link: ''
            },
            billingAddress: {
              firstname: 'Jeanne',
              lastname: "D'arc",
              address: '12 avenue du bois, 54321, Boisville',
              phone: '9876543210'
            },
            lines: [
              {
                img: dolodent.img,
                name: dolodent.name,
                unitPrice: '5,50\u00A0€',
                quantity: 1,
                total: '5,50\u00A0€'
              },
              {
                img: ultraLevure.img,
                name: ultraLevure.name,
                unitPrice: '4,75\u00A0€',
                quantity: 2,
                total: '9,50\u00A0€'
              }
            ],
            totals: {
              productPrice: '15,00\u00A0€',
              shippingPrice: 'Gratuit',
              price: '15,00\u00A0€'
            }
          }
        ]
        expectEmailsToHaveBeenSent(...expectedEmails)
      })
    })
    describe('Prepare one order', () => {
      beforeEach(async () => {
        await whenStartPreparationForOrders(orderToPrepare1.uuid)
      })
      it('should set each order line to processing', async () => {
        await expectOrdersToEqual(expectedOrder1, orderToPrepare2)
      })
      it('should remove order from preparations', () => {
        expectPreparationStoreToEqual(expectedOrder1, orderToPrepare2)
      })
    })
    describe('Prepare another one order', () => {
      beforeEach(async () => {
        await whenStartPreparationForOrders(orderToPrepare2.uuid)
      })
      it('should set each order line to processing', async () => {
        await expectOrdersToEqual(orderToPrepare1, expectedOrder2)
      })
      it('should remove order from preparations', () => {
        expectPreparationStoreToEqual(orderToPrepare1, expectedOrder2)
      })
    })
  })

  const givenThereIsOrdersToPrepare = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
    preparationStore.items = orders
  }

  const givenThereIsExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
    productStore.items = products
  }

  const whenStartPreparationForOrders = async (...ordersUuids: Array<UUID>) => {
    preparationStore.selected = ordersUuids
    await startPreparations(orderGateway, emailGateway)
  }

  const expectOrdersToEqual = async (...expectedOrders: Array<Order>) => {
    const orders = await orderGateway.list()
    expect(orders).toStrictEqual(expectedOrders)
  }

  const expectPreparationStoreToEqual = (...preparations: Array<Order>) => {
    expect(preparationStore.items).toStrictEqual(preparations)
  }

  const expectSelectionToBeEmpty = () => {
    expect(preparationStore.selected).toStrictEqual([])
  }

  const expectEmailsToHaveBeenSent = (
    ...expectedEmails: Array<EmailMessage>
  ) => {
    expect(emailGateway.list()).toStrictEqual(expectedEmails)
  }
})
