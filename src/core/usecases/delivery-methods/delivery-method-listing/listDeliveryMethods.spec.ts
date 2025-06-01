import { DeliveryMethod } from '@core/entities/order'
import { InMemoryDeliveryMethodGateway } from '@adapters/secondary/delivery-method-gateways/inMemoryDeliveryMethodGateway'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import {
  clickAndCollect,
  deliveryInRelayPoint,
  express
} from '@utils/testData/deliveryMethods'
import { createPinia, setActivePinia } from 'pinia'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'

describe('Delivery method listing', () => {
  let deliveryMethodStore: any
  let deliveryMethodGateway: InMemoryDeliveryMethodGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryMethodGateway = new InMemoryDeliveryMethodGateway()
    deliveryMethodStore = useDeliveryMethodStore()
  })

  describe('There is some delivery methods', () => {
    beforeEach(async () => {
      givenExistingDeliveryMethods(
        clickAndCollect,
        deliveryInRelayPoint,
        express
      )
      await whenListDeliveryMethods()
    })
    it('should save the delivery methods in the store', () => {
      expect(deliveryMethodStore.items).toStrictEqual([
        clickAndCollect,
        deliveryInRelayPoint,
        express
      ])
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = deliveryMethodStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListDeliveryMethods()
    })
    it('should be aware that loading is over', async () => {
      await whenListDeliveryMethods()
      expect(deliveryMethodStore.isLoading).toBe(false)
    })
  })

  const givenExistingDeliveryMethods = (
    ...deliveryMethods: Array<DeliveryMethod>
  ) => {
    deliveryMethodGateway.feedWith(...deliveryMethods)
  }

  const whenListDeliveryMethods = async () => {
    await listDeliveryMethods(deliveryMethodGateway)
  }
})
