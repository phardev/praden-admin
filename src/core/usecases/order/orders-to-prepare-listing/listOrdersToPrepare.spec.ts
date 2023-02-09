import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { Order } from '@core/usecases/order/orders-to-prepare-listing/order'
import { orderToPrepare1 } from '@utils/testData/orders'
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

  const whenListOrdersToPrepare = async () => {
    await listOrdersToPrepare(orderGateway)
  }

  const expectPreparationStoreToContains = (
    ...expectedOrders: Array<Order>
  ) => {
    expect(preparationStore.items).toStrictEqual(expectedOrders)
  }
})
