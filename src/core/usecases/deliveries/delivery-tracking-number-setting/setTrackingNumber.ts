import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'

export const setTrackingNumber = async (
  uuid: UUID,
  trackingNumber: string,
  deliveryGateway: DeliveryGateway
) => {
  await deliveryGateway.setTrackingNumber(uuid, trackingNumber)
}
