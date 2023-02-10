import { usePreparationStore } from '@store/preparationStore'
import { OrderGateway } from '@core/gateways/orderGateway'

export const listOrdersToPrepare = async (orderGateway: OrderGateway) => {
  const orders = await orderGateway.listOrdersToPrepare()
  const preparationStore = usePreparationStore()
  preparationStore.list(orders)
}
