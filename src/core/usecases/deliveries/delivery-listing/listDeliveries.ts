import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { useDeliveryStore } from '@store/deliveryStore'

export const listDeliveries = async (deliveryGateway: DeliveryGateway) => {
  const deliveryStore = useDeliveryStore()
  try {
    deliveryStore.startLoading()
    const deliveries = await deliveryGateway.list()
    deliveryStore.list(deliveries)
  } finally {
    deliveryStore.stopLoading()
  }
}
