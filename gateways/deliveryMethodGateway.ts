import { InMemoryDeliveryMethodGateway } from '@adapters/secondary/delivery-method-gateways/inMemoryDeliveryMethodGateway'
import { RealDeliveryMethodGateway } from '@adapters/secondary/delivery-method-gateways/realDeliveryMethodGateway'
import { isLocalEnv } from '@utils/env'
import * as deliveryMethods from '@utils/testData/deliveryMethods'

const deliveryMethodGateway = new InMemoryDeliveryMethodGateway()
deliveryMethodGateway.feedWith(...Object.values(deliveryMethods))

export const useDeliveryMethodGateway = () => {
  if (isLocalEnv()) {
    return deliveryMethodGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealDeliveryMethodGateway(BACKEND_URL)
}
