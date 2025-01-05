import { UUID } from '@core/types/types'
import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { useDeliveryStore } from '@store/deliveryStore'

export const markDeliveryAsDelivered = async (
  uuid: UUID,
  deliveryGateway: DeliveryGateway
) => {
  const deliveryStore = useDeliveryStore()
  deliveryStore.startLoading()
  const delivered = await deliveryGateway.markAsDelivered(uuid)
  deliveryStore.edit(delivered)
  deliveryStore.stopLoading()
}
