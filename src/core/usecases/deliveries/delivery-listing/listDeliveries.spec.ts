import { useDeliveryStore } from '@store/deliveryStore'
import { createPinia, setActivePinia } from 'pinia'
import { Delivery } from '@core/entities/order'
import { InMemoryDeliveryGateway } from '@adapters/secondary/delivery-gateways/inMemoryDeliveryGateway'
import { listDeliveries } from './listDeliveries'
import {
  deliveryOrderToPrepare1,
  deliveryOrderToPrepare2,
  deliveryOrderToPrepare3
} from '@utils/testData/deliveries'

describe('Delivery listing', () => {
  let deliveryStore: any
  let deliveryGateway: InMemoryDeliveryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryStore = useDeliveryStore()
    deliveryGateway = new InMemoryDeliveryGateway()
  })

  describe('There is no delivery', () => {
    it('should list nothing', async () => {
      givenExistingDeliveries()
      await whenListDeliveries()
      expectDeliveryStoreToContains()
    })
  })

  describe('There is some deliveries', () => {
    it('should list all of them', async () => {
      givenExistingDeliveries(
        deliveryOrderToPrepare1,
        deliveryOrderToPrepare2,
        deliveryOrderToPrepare3
      )
      await whenListDeliveries()
      expectDeliveryStoreToContains(
        deliveryOrderToPrepare1,
        deliveryOrderToPrepare2,
        deliveryOrderToPrepare3
      )
    })
  })
  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = deliveryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListDeliveries()
    })
    it('should be aware when loading is done', async () => {
      await whenListDeliveries()
      expect(deliveryStore.isLoading).toBe(false)
    })
  })

  const givenExistingDeliveries = (...deliveries: Array<Delivery>) => {
    deliveryGateway.feedWith(...deliveries)
  }

  const whenListDeliveries = async () => {
    await listDeliveries(deliveryGateway)
  }

  const expectDeliveryStoreToContains = (...deliveries: Array<Delivery>) => {
    expect(deliveryStore.items).toStrictEqual(deliveries)
  }
})
