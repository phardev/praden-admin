import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
import { validatePreparation } from '@core/usecases/order/validate-preparation/validatePreparation'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { DeliveryStatus, Order } from '@core/entities/order'
import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'
import { FakeDateProvider } from '@adapters/secondary/fakeDateProvider'
import { Invoice } from '@core/entities/invoice'
import { InMemoryInvoiceGateway } from '@adapters/secondary/inMemoryInvoiceGateway'
import { useInvoiceStore } from '@store/invoiceStore'
import { Timestamp } from '@core/types/types'

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
      givenThereIsAPreparationSelected(order)
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      await whenValidatePreparation()
    })
    it('should save it', async () => {
      const expectedOrder: Order = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
      expectedOrder.lines[0].updatedAt = now
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
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
      givenThereIsExistingOrders(order)
      givenThereIsAPreparationSelected(order)
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      order.lines[0].updatedAt = now
      order.lines[1].preparedQuantity = order.lines[1].expectedQuantity
      order.lines[1].updatedAt = now
      await whenValidatePreparation()
    })
    it('should save it', async () => {
      const expectedOrder: Order = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
      expectedOrder.lines[1].deliveryStatus = DeliveryStatus.Shipped
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
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

  describe('There is no current preparation', () => {
    it('should throw an error', async () => {
      await expect(whenValidatePreparation()).rejects.toThrow(
        NoPreparationSelectedError
      )
    })
  })

  const givenThereIsExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
  }

  const givenThereIsAPreparationSelected = (order: Order) => {
    preparationStore.current = order
  }

  const whenValidatePreparation = async () => {
    await validatePreparation(orderGateway, invoiceGateway)
  }
})
