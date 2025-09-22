import { describe, it, expect, beforeEach } from 'vitest'
import { downloadDeliveryLabel } from './downloadDeliveryLabel'
import { InMemoryDeliveryGateway } from '@adapters/secondary/delivery-gateways/inMemoryDeliveryGateway'
import { deliveryOrderToPrepare3 } from '@utils/testData/deliveries'
import { UUID } from '@core/types/types'
import { useDeliveryStore } from '@store/deliveryStore'
import { setActivePinia, createPinia } from 'pinia'

describe('downloadDeliveryLabel', () => {
  let deliveryGateway: InMemoryDeliveryGateway
  let deliveryStore: ReturnType<typeof useDeliveryStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryGateway = new InMemoryDeliveryGateway()
    deliveryStore = useDeliveryStore()
  })

  it('should download the delivery label', async () => {
    const delivery = deliveryOrderToPrepare3
    await whenDownloadDeliveryLabel(delivery.uuid)
    expect(deliveryGateway.listDownloaded()).toStrictEqual([delivery.uuid])
  })

  it('should store the delivery label in the store', async () => {
    const delivery = deliveryOrderToPrepare3
    await whenDownloadDeliveryLabel(delivery.uuid)
    expect(deliveryStore.labelBlob).toStrictEqual(new Blob([delivery.uuid]))
  })

  const whenDownloadDeliveryLabel = async (uuid: UUID) => {
    await downloadDeliveryLabel({ deliveryGateway })(uuid)
  }
})
