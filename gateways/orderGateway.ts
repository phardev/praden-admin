import { RealOrderGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import * as orders from '@utils/testData/orders'
import { isLocalEnv } from '@utils/env'

export const useOrderGateway = () => {
  if (isLocalEnv()) {
    const orderGateway = new InMemoryOrderGateway(new RealDateProvider())
    orderGateway.feedWith(...Object.values(orders))
    return orderGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealOrderGateway(BACKEND_URL)
}
