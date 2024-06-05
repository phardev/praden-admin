import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { validatePreparation } from '@core/usecases/order/validate-preparation/validatePreparation'
import {
  orderToPrepare1,
  orderToPrepare2,
  orderWithMissingProduct1,
  orderWithMissingProduct2
} from '@utils/testData/orders'
import { DeliveryStatus, Order } from '@core/entities/order'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { Invoice } from '@core/entities/invoice'
import { InMemoryInvoiceGateway } from '@adapters/secondary/invoice-gateways/InMemoryInvoiceGateway'
import { useInvoiceStore } from '@store/invoiceStore'
import { Timestamp } from '@core/types/types'
import { dolodent, ultraLevure } from '@utils/testData/products'

describe('Validate preparation', () => {
  let preparationStore: any
  let invoiceStore: any
  let orderGateway: InMemoryOrderGateway
  let invoiceGateway: InMemoryInvoiceGateway
  const dateProvider = new FakeDateProvider()
  let now: Timestamp

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    invoiceStore = useInvoiceStore()
    orderGateway = new InMemoryOrderGateway(dateProvider)
    invoiceGateway = new InMemoryInvoiceGateway(dateProvider)
  })

  describe('The preparation is fully prepared', () => {
    const order: Order = JSON.parse(JSON.stringify(orderToPrepare1))
    beforeEach(async () => {
      now = 1234567891234
      dateProvider.feedWith(now)
      givenThereIsExistingOrders(order)
      order.lines.forEach((l) => {
        l.preparedQuantity = l.expectedQuantity
      })
      givenThereIsAPreparationSelected(order)
      await whenValidatePreparation()
    })
    it('should save it', async () => {
      const expectedOrder: Order = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
      expectedOrder.lines[0].updatedAt = now
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
    })
    it('should remove it from preparation store', async () => {
      expectPreparationStoreToEqual()
    })
    describe('Invoice', () => {
      let expectedInvoiceNumber: string
      let expectedInvoice: Invoice
      beforeEach(() => {
        expectedInvoiceNumber = order.payment.invoiceNumber
        const expectedOrder: Order = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
        expectedOrder.lines[0].updatedAt = now
        expectedInvoice = {
          id: expectedInvoiceNumber,
          data: expectedOrder,
          createdAt: now
        }
      })
      it('should create the invoice', async () => {
        expect(await invoiceGateway.get(expectedInvoiceNumber)).toStrictEqual(
          expectedInvoice
        )
      })
      it('should save the invoice in the store', async () => {
        expect(invoiceStore.current).toStrictEqual(expectedInvoice)
      })
    })
  })
  describe('Another preparation is fully prepared', () => {
    const order: Order = JSON.parse(JSON.stringify(orderToPrepare2))
    beforeEach(async () => {
      now = 9876543216549
      dateProvider.feedWith(now)
      givenThereIsExistingOrders(order, orderToPrepare1)
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      order.lines[0].updatedAt = now
      order.lines[1].preparedQuantity = order.lines[1].expectedQuantity
      order.lines[1].updatedAt = now
      givenThereIsAPreparationSelected(order)
      await whenValidatePreparation()
    })
    it('should save it', async () => {
      const expectedOrder: Order = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
      expectedOrder.lines[1].deliveryStatus = DeliveryStatus.Shipped
      expect(await orderGateway.list()).toStrictEqual([
        expectedOrder,
        orderToPrepare1
      ])
    })
    it('should remove it from preparation store', async () => {
      expectPreparationStoreToEqual(orderToPrepare1)
    })
    describe('Invoice', () => {
      let expectedInvoiceNumber: string
      let expectedInvoice: Invoice
      beforeEach(() => {
        expectedInvoiceNumber = order.payment.invoiceNumber
        const expectedOrder: Order = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
        expectedOrder.lines[1].deliveryStatus = DeliveryStatus.Shipped
        expectedInvoice = {
          id: expectedInvoiceNumber,
          data: expectedOrder,
          createdAt: now
        }
      })
      it('should create the invoice', async () => {
        expect(await invoiceGateway.get(expectedInvoiceNumber)).toStrictEqual(
          expectedInvoice
        )
      })
      it('should save the invoice in store', async () => {
        expect(invoiceStore.current).toStrictEqual(expectedInvoice)
      })
    })
  })

  describe('Preparation is partially validated', () => {
    describe('A line cannot be prepared at all', () => {
      let order: Order
      let expectedOrder: Order
      beforeEach(async () => {
        order = JSON.parse(JSON.stringify(orderWithMissingProduct1))
        now = 1234567891234
        dateProvider.feedWith(now)
        givenThereIsExistingOrders(order)
        expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
        expectedOrder.lines[0].updatedAt = now
        expectedOrder.lines[1].deliveryStatus = DeliveryStatus.Canceled
        expectedOrder.lines[1].updatedAt = now
        expectedOrder.lines[2] = {
          name: ultraLevure.name,
          cip13: ultraLevure.cip13,
          expectedQuantity: -4,
          preparedQuantity: 0,
          unitAmount: ultraLevure.priceWithoutTax,
          percentTaxRate: ultraLevure.percentTaxRate,
          locations: ultraLevure.locations,
          deliveryStatus: DeliveryStatus.Canceled,
          updatedAt: now
        }
        givenThereIsAPreparationSelected(order)
        await whenValidatePreparation()
      })
      it('should save it and create new lines for missing products', async () => {
        expect(await orderGateway.list()).toStrictEqual([expectedOrder])
      })
      it('should remove it from preparation store', async () => {
        expectPreparationStoreToEqual()
      })
      describe('Invoice', () => {
        let expectedInvoiceNumber: string
        let expectedInvoice: Invoice
        beforeEach(() => {
          expectedInvoiceNumber = order.payment.invoiceNumber
          expectedInvoice = {
            id: expectedInvoiceNumber,
            data: expectedOrder,
            createdAt: now
          }
        })
        it('should create the invoice', async () => {
          expect(await invoiceGateway.get(expectedInvoiceNumber)).toStrictEqual(
            expectedInvoice
          )
        })
        it('should save the invoice in store', async () => {
          expect(invoiceStore.current).toStrictEqual(expectedInvoice)
        })
      })
    })
    describe('Multiple lines cannot be fully prepared', () => {
      const order: Order = JSON.parse(JSON.stringify(orderWithMissingProduct2))
      beforeEach(async () => {
        now = 1234567894321
        dateProvider.feedWith(now)
        givenThereIsExistingOrders(order)
        givenThereIsAPreparationSelected(order)
        await whenValidatePreparation()
      })
      it('should save it and create new lines for missing products', async () => {
        const expectedOrder: Order = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
        expectedOrder.lines[0].updatedAt = now
        expectedOrder.lines[1].deliveryStatus = DeliveryStatus.Shipped
        expectedOrder.lines[1].updatedAt = now
        expectedOrder.lines[2] = {
          name: dolodent.name,
          cip13: dolodent.cip13,
          expectedQuantity: -1,
          preparedQuantity: 0,
          unitAmount: dolodent.priceWithoutTax,
          percentTaxRate: dolodent.percentTaxRate,
          locations: dolodent.locations,
          deliveryStatus: DeliveryStatus.Canceled,
          updatedAt: now
        }
        expectedOrder.lines[3] = {
          name: ultraLevure.name,
          cip13: ultraLevure.cip13,
          expectedQuantity: -2,
          preparedQuantity: 0,
          unitAmount: ultraLevure.priceWithoutTax,
          percentTaxRate: ultraLevure.percentTaxRate,
          locations: ultraLevure.locations,
          deliveryStatus: DeliveryStatus.Canceled,
          updatedAt: now
        }
        expect(await orderGateway.list()).toStrictEqual([expectedOrder])
      })
    })
  })

  describe('There is no current preparation', () => {
    it('should throw an error', async () => {
      await expect(whenValidatePreparation()).rejects.toThrow(
        NoPreparationSelectedError
      )
    })
  })

  const givenThereIsExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
    preparationStore.items = orders
  }

  const givenThereIsAPreparationSelected = (order: Order) => {
    preparationStore.current = JSON.parse(JSON.stringify(order))
  }

  const whenValidatePreparation = async () => {
    await validatePreparation(orderGateway, invoiceGateway)
  }

  const expectPreparationStoreToEqual = (...orders: Array<Order>) => {
    expect(preparationStore.items).toStrictEqual(orders)
  }
})
