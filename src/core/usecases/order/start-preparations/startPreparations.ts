import { UUID } from '@core/types/types'
import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'

export const startPreparations = async (
  ordersUuids: Array<UUID>,
  orderGateway: OrderGateway
) => {
  const preparationStore = usePreparationStore()
  for (const uuid of ordersUuids) {
    await orderGateway.startPreparation(uuid)
    preparationStore.remove(uuid)
  }
}
