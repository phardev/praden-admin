import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { Order } from '@core/entities/order'
import {
  orderDelivered1,
  orderDelivered2,
  orderInPreparation1,
  orderNotPayed1,
  orderPrepared1,
  orderToPrepare1,
  orderToPrepare2,
  orderWithMissingProduct1
} from '@utils/testData/orders'
import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'
import { FakeDateProvider } from '@adapters/secondary/fakeDateProvider'

describe('List orders to prepare', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
  })

  describe('There is no orders to prepare', () => {
    it('should list nothing', async () => {
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
  })
  describe('There is some orders to prepare', () => {
    it('should list all of them', async () => {
      givenExistingOrders(orderToPrepare1, orderToPrepare2)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains(orderToPrepare1, orderToPrepare2)
    })
    it('should list orders if all items are processing', async () => {
      givenExistingOrders(orderInPreparation1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains(orderInPreparation1)
    })
    it('should list orders if at least one item is still processing', async () => {
      givenExistingOrders(orderWithMissingProduct1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains(orderWithMissingProduct1)
    })
  })
  describe('There is some orders to not prepare', () => {
    it('should not list orders if all items are shipped', async () => {
      givenExistingOrders(orderPrepared1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
    it('should not list orders if all items are delivered', async () => {
      givenExistingOrders(orderDelivered1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
    it('should not list orders if they are not payed', async () => {
      givenExistingOrders(orderNotPayed1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
  })

  describe('With lot of orders', () => {
    it('should list only preparable orders', async () => {
      givenExistingOrders(
        orderPrepared1,
        orderDelivered1,
        orderToPrepare1,
        orderInPreparation1,
        orderToPrepare2,
        orderWithMissingProduct1,
        orderDelivered2
      )
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains(
        orderToPrepare1,
        orderInPreparation1,
        orderToPrepare2,
        orderWithMissingProduct1
      )
    })
  })

  const givenExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
  }

  const whenListOrdersToPrepare = async () => {
    await listOrdersToPrepare(orderGateway)
  }

  const expectPreparationStoreToContains = (
    ...expectedOrders: Array<Order>
  ) => {
    expect(preparationStore.items).toStrictEqual(expectedOrders)
  }
})
