import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'

export const printDeliveryLabel = async (
  uuid: UUID,
  deliveryGateway: DeliveryGateway
) => {
  await deliveryGateway.printLabel(uuid)
}
