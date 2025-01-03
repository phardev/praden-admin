import { InMemoryDeliveryGateway } from '@adapters/secondary/delivery-gateways/inMemoryDeliveryGateway'
import { useDeliveryStore } from '@store/deliveryStore'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import { UUID } from '@core/types/types'
import {
  deliveryOrderToPrepare3,
  deliveryOrderWithMissingProduct
} from '@utils/testData/deliveries'
import { createPinia, setActivePinia } from 'pinia'
import { shipDeliveries } from './shipDeliveries'

describe('Delivery shipping', () => {
  let deliveryStore: any
  let deliveryGateway: InMemoryDeliveryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryStore = useDeliveryStore()
    deliveryGateway = new InMemoryDeliveryGateway()
  })

  describe('Existing deliveries', () => {
    beforeEach(async () => {
      givenExistingDeliveries(
        deliveryOrderToPrepare3,
        deliveryOrderWithMissingProduct
      )
      await whenShipDeliveries(
        deliveryOrderToPrepare3.uuid,
        deliveryOrderWithMissingProduct.uuid
      )
    })
    it('should save the shipped deliveries in the store', async () => {
      expect(deliveryStore.items).toStrictEqual([
        { ...deliveryOrderToPrepare3, status: DeliveryStatus.Shipped },
        { ...deliveryOrderWithMissingProduct, status: DeliveryStatus.Shipped }
      ])
    })
    it('should ship the deliveries', async () => {
      expect(await deliveryGateway.list()).toStrictEqual([
        { ...deliveryOrderToPrepare3, status: DeliveryStatus.Shipped },
        { ...deliveryOrderWithMissingProduct, status: DeliveryStatus.Shipped }
      ])
    })
  })

  const givenExistingDeliveries = (...deliveries: Array<Delivery>) => {
    deliveryGateway.feedWith(...deliveries)
    deliveryStore.items = deliveries
  }

  const whenShipDeliveries = async (...uuids: Array<UUID>) => {
    await shipDeliveries(uuids, deliveryGateway)
  }
})
