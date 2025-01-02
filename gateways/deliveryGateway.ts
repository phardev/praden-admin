import * as deliveries from '@utils/testData/deliveries'
import { isLocalEnv } from '@utils/env'
import { InMemoryDeliveryGateway } from '@adapters/secondary/delivery-gateways/inMemoryDeliveryGateway'
import { RealDeliveryGateway } from '@adapters/secondary/delivery-gateways/realDeliveryGateway'

const deliveryGateway = new InMemoryDeliveryGateway()
deliveryGateway.feedWith(...Object.values(deliveries))

export const useDeliveryGateway = () => {
  if (isLocalEnv()) {
    return deliveryGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealDeliveryGateway(BACKEND_URL)
}
