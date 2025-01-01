import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { useDeliveryStore } from '@store/deliveryStore'

export const listDeliveries = async (deliveryGateway: DeliveryGateway) => {
  const deliveryStore = useDeliveryStore()
  deliveryStore.startLoading()
  const deliveries = await deliveryGateway.list()
  deliveryStore.list(deliveries)
  deliveryStore.stopLoading()
}
