import { createPinia, setActivePinia } from 'pinia'
import { OrderLineStatus, Order } from '@core/entities/order'
import { orderToCancel } from '@utils/testData/orders'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { cancelPreparation } from '@core/usecases/order/cancel-preparation/cancelPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { Invoice } from '@core/entities/invoice'
import { useInvoiceStore } from '@store/invoiceStore'
import { InMemoryInvoiceGateway } from '@adapters/secondary/invoice-gateways/InMemoryInvoiceGateway'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'

describe('Cancel preparation', () => {
  let preparationStore: any
  let invoiceStore: any
  let orderGateway: InMemoryOrderGateway
  let invoiceGateway: InMemoryInvoiceGateway
  const dateProvider = new FakeDateProvider()

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    invoiceStore = useInvoiceStore()
  })
  describe('The preparation exists', () => {
    let order: Order
    let expectedOrder: Order
    const now = 1234567890
    beforeEach(async () => {
      order = JSON.parse(JSON.stringify(orderToCancel))
      dateProvider.feedWith(now)
      orderGateway = new InMemoryOrderGateway(dateProvider)
      invoiceGateway = new InMemoryInvoiceGateway(dateProvider)
      givenPreparationsExists(order)
      givenCurrentPreparationIs(order)
      expectedOrder = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].preparedQuantity = 0
      expectedOrder.lines[0].status = OrderLineStatus.Canceled
      expectedOrder.lines[0].updatedAt = now
      expectedOrder.lines[1] = {
        ...expectedOrder.lines[0],
        expectedQuantity: -2,
        preparedQuantity: 0,
        status: OrderLineStatus.Canceled,
        updatedAt: now
      }
      await whenCancelPreparation()
    })
    it('should save the preparation in order gateway', async () => {
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
    })
    it('should remove it from store', () => {
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
  describe('There is no current preparation', () => {
    it('should throw an error', async () => {
      await expect(whenCancelPreparation()).rejects.toThrow(
        NoPreparationSelectedError
      )
    })
  })

  const givenPreparationsExists = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
    preparationStore.items = orders
  }
  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = JSON.parse(JSON.stringify(order))
  }

  const whenCancelPreparation = async () => {
    await cancelPreparation(orderGateway, invoiceGateway)
  }

  const expectPreparationStoreToEqual = (...orders: Array<Order>) => {
    expect(preparationStore.items).toStrictEqual(orders)
  }
})
