import { DeliveryMethodGateway } from '@core/gateways/deliveryMethodGateway'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'

export const listDeliveryMethods = async (
  deliveryMethodGateway: DeliveryMethodGateway
) => {
  const deliveryMethodStore = useDeliveryMethodStore()
  deliveryMethodStore.startLoading()
  const deliveryMethods = await deliveryMethodGateway.list()
  deliveryMethodStore.list(deliveryMethods)
  deliveryMethodStore.stopLoading()
}
