import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'

export const startPreparations = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  const ordersUuids = preparationStore.selected
  for (const uuid of ordersUuids) {
    await orderGateway.startPreparation(uuid)
    preparationStore.remove(uuid)
  }
}
