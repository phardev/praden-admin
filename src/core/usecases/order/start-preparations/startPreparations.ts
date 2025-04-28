import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'

export const startPreparations = async (orderGateway: OrderGateway) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const ordersUuids = preparationStore.selected
    const orders = await Promise.all(
      ordersUuids.map((uuid) => orderGateway.startPreparation(uuid))
    )
    orders.forEach((order) => preparationStore.update(order))
    preparationStore.clearSelection()
  } finally {
    preparationStore.stopLoading()
  }
}
