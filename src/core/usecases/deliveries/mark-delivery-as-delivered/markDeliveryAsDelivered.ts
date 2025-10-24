import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'
import { useDeliveryStore } from '@store/deliveryStore'

export const markDeliveryAsDelivered = async (
  uuid: UUID,
  deliveryGateway: DeliveryGateway
) => {
  const deliveryStore = useDeliveryStore()
  try {
    deliveryStore.startLoading()
    const delivered = await deliveryGateway.markAsDelivered(uuid)
    deliveryStore.edit(delivered)
  } finally {
    deliveryStore.stopLoading()
  }
}
