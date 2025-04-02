import { OrderGateway } from '@core/gateways/orderGateway'
import { useOrderStore } from '@store/orderStore'

export const listOrders = async (orderGateway: OrderGateway) => {
  const orderStore = useOrderStore()
  try {
    orderStore.startLoading()
    const orders = await orderGateway.list()
    orderStore.list(orders)
  } finally {
    orderStore.stopLoading()
  }
}
