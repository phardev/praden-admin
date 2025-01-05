import { InMemoryDeliveryGateway } from '@adapters/secondary/delivery-gateways/inMemoryDeliveryGateway'
import { useDeliveryStore } from '@store/deliveryStore'
import { createPinia, setActivePinia } from 'pinia'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import { UUID } from '@core/types/types'
import { deliveryOrderPrepared1 } from '@utils/testData/deliveries'
import { markDeliveryAsDelivered } from '@core/usecases/deliveries/mark-delivery-as-delivered/markDeliveryAsDelivered'

describe('Mark delivery as delivered', () => {
  let deliveryStore: any
  let deliveryGateway: InMemoryDeliveryGateway
  let expectedDelivery: Delivery

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryGateway = new InMemoryDeliveryGateway()
    deliveryStore = useDeliveryStore()
    givenExistingDeliveries(deliveryOrderPrepared1)
  })

  describe('The delivery exists', () => {
    beforeEach(async () => {
      expectedDelivery = {
        ...deliveryOrderPrepared1,
        status: DeliveryStatus.Delivered
      }
      await whenMarkDeliveryAsDelivered(deliveryOrderPrepared1.uuid)
    })
    it('should save the delivery in the store', () => {
      expect(deliveryStore.items).toStrictEqual([expectedDelivery])
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
      await whenMarkDeliveryAsDelivered(deliveryOrderPrepared1.uuid)
    })
    it('should be aware that loading is over', async () => {
      await whenMarkDeliveryAsDelivered(deliveryOrderPrepared1.uuid)
      expect(deliveryStore.isLoading).toBe(false)
    })
  })

  const givenExistingDeliveries = (...deliveries: Array<Delivery>) => {
    deliveryGateway.feedWith(...deliveries)
    deliveryStore.items = JSON.parse(JSON.stringify(deliveries))
  }

  const whenMarkDeliveryAsDelivered = async (uuid: UUID) => {
    await markDeliveryAsDelivered(uuid, deliveryGateway)
  }
})
