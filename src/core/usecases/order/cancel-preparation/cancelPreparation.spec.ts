import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { Order, OrderLineStatus } from '@core/entities/order'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { cancelPreparation } from '@core/usecases/order/cancel-preparation/cancelPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { orderToCancel } from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'

describe('Cancel preparation', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway
  const dateProvider = new FakeDateProvider()

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('The preparation exists', () => {
    let order: Order
    let expectedOrder: Order
    const now = 1234567890
    beforeEach(async () => {
      order = JSON.parse(JSON.stringify(orderToCancel))
      dateProvider.feedWith(now)
      orderGateway = new InMemoryOrderGateway(dateProvider)
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
  })
  describe('Loading', () => {
    beforeEach(() => {
      givenPreparationsExists(orderToCancel)
      givenCurrentPreparationIs(orderToCancel)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = preparationStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenCancelPreparation()
    })
    it('should be aware that loading is over', async () => {
      await whenCancelPreparation()
      expect(preparationStore.isLoading).toBe(false)
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
    await cancelPreparation(orderGateway)
  }

  const expectPreparationStoreToEqual = (...orders: Array<Order>) => {
    expect(preparationStore.items).toStrictEqual(orders)
  }
})
