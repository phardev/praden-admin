import * as deliveryMethods from '@utils/testData/deliveryMethods'
import { isLocalEnv } from '@utils/env'
import { InMemoryDeliveryMethodGateway } from '@core/usecases/delivery-methods/delivery-method-listing/inMemoryDeliveryMethodGateway'

const deliveryMethodGateway = new InMemoryDeliveryMethodGateway()
deliveryMethodGateway.feedWith(...Object.values(deliveryMethods))

export const useDeliveryMethodGateway = () => {
  if (isLocalEnv()) {
    return deliveryMethodGateway
  }
  return deliveryMethodGateway
  // const { BACKEND_URL } = useRuntimeConfig().public
  // return new RealDeliveryGateway(BACKEND_URL)
}
