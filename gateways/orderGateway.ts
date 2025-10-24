import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import { InMemoryTimoutOrderGateway } from '@adapters/secondary/order-gateways/InMemoryTimeoutOrderGateway'
import { RealOrderGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'

import { isLocalEnv } from '@utils/env'
import * as orders from '@utils/testData/orders'

const orderGateway = new InMemoryTimoutOrderGateway(500, new RealDateProvider())
orderGateway.feedWith(...Object.values(orders))

export const useOrderGateway = () => {
  if (isLocalEnv()) {
    return orderGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealOrderGateway(BACKEND_URL)
}
