import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'
import { useDeliveryStore } from '@store/deliveryStore'

interface DownloadDeliveryLabelDependencies {
  deliveryGateway: DeliveryGateway
}

export const downloadDeliveryLabel =
  (deps: DownloadDeliveryLabelDependencies) => async (uuid: UUID) => {
    const blob = await deps.deliveryGateway.downloadLabel(uuid)
    const deliveryStore = useDeliveryStore()
    deliveryStore.setLabelBlob(blob)
  }
