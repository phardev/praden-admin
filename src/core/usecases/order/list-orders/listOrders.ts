import { OrderGateway } from '@core/gateways/orderGateway'
import { useOrderStore } from '@store/orderStore'

export const listOrders = async (
  limit: number,
  offset: number,
  orderGateway: OrderGateway
) => {
  const orderStore = useOrderStore()

  if (orderStore.isLoading) {
    return
  }

  try {
    orderStore.startLoading()
    const orders = await orderGateway.list(limit, offset)
    orderStore.list(orders)
  } finally {
    orderStore.stopLoading()
  }
}
