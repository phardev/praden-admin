import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { Order } from '@core/entities/order'
import { useOrderStore } from '@store/orderStore'
import {
  orderNotPayed1,
  orderPrepared1,
  orderToPrepare1
} from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'
import { listOrders } from './listOrders'

describe('List orders', () => {
  let orderStore: any
  let orderGateway: InMemoryOrderGateway

  const defaultLimit = 25

  beforeEach(() => {
    setActivePinia(createPinia())
    orderStore = useOrderStore()
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
  })

  describe('There is no orders', () => {
    it('should list nothing', async () => {
      await whenListOrders()
      expectOrderStoreToContains()
    })
    it('should mark hasMore as false', async () => {
      await whenListOrders()
      expect(orderStore.hasMore).toBe(false)
    })
  })

  describe('There is some orders', () => {
    it('should list all of them', async () => {
      givenExistingOrders(orderToPrepare1, orderPrepared1, orderNotPayed1)
      await whenListOrders()
      expectOrderStoreToContains(
        orderToPrepare1,
        orderPrepared1,
        orderNotPayed1
      )
    })
    it('should mark hasMore as true', async () => {
      givenExistingOrders(orderToPrepare1)
      await whenListOrders()
      expect(orderStore.hasMore).toBe(true)
    })
    it('should append on subsequent pages', async () => {
      givenExistingOrders(orderToPrepare1, orderPrepared1, orderNotPayed1)
      await listOrders(1, 0, orderGateway)
      await listOrders(1, 1, orderGateway)
      expectOrderStoreToContains(orderToPrepare1, orderPrepared1)
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = orderStore.$subscribe((mutation: any, state: any) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })
      await whenListOrders()
    })
    it('should be aware when loading is done', async () => {
      await whenListOrders()
      expect(orderStore.isLoading).toBe(false)
    })
  })

  const givenExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
  }

  const whenListOrders = async () => {
    await listOrders(defaultLimit, 0, orderGateway)
  }

  const expectOrderStoreToContains = (...orders: Array<Order>) => {
    expect(orderStore.items).toStrictEqual(orders)
  }
})
