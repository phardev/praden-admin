import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { Order } from '@core/entities/order'
import {
  orderDelivered1,
  orderInPreparation1,
  orderPrepared1,
  orderToPrepare1,
  orderWithMissingProduct1
} from '@utils/testData/orders'
import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'

describe('List orders to prepare', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    orderGateway = new InMemoryOrderGateway()
  })

  describe('There is no orders to prepare', () => {
    it('should list nothing', async () => {
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
  })
  describe('There is some orders to prepare', () => {
    it('should list all of them', async () => {
      orderGateway.feedWith(orderToPrepare1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains(orderToPrepare1)
    })
  })
  describe('There is some orders to not prepare', () => {
    it('should not list orders if all items are shipped', async () => {
      orderGateway.feedWith(orderPrepared1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
    it('should not list orders if all items are processing', async () => {
      orderGateway.feedWith(orderInPreparation1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
    it('should not list orders if all items are delivered', async () => {
      orderGateway.feedWith(orderDelivered1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
    it('should not list orders if at least one item is not created', async () => {
      orderGateway.feedWith(orderWithMissingProduct1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
  })

  const whenListOrdersToPrepare = async () => {
    await listOrdersToPrepare(orderGateway)
  }

  const expectPreparationStoreToContains = (
    ...expectedOrders: Array<Order>
  ) => {
    expect(preparationStore.items).toStrictEqual(expectedOrders)
  }
})
