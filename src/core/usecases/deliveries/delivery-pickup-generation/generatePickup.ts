import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'

export const generatePickup = async (
  orderUuid: UUID,
  deliveryGateway: DeliveryGateway
) => {
  await deliveryGateway.generatePickup(orderUuid)
}
