import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'
import { useDeliveryStore } from '@store/deliveryStore'

export const shipDeliveries = async (
  uuids: Array<UUID>,
  deliveryGateway: DeliveryGateway
): Promise<void> => {
  const deliveryStore = useDeliveryStore()
  const shipped = await deliveryGateway.ship(uuids)
  shipped.forEach((delivery) => {
    deliveryStore.edit(delivery)
  })
}
