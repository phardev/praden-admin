import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import * as orders from '@utils/testData/orders'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'

export const useOrderGateway = () => {
  // const { BACKEND_URL } = useRuntimeConfig()
  // return new RealOrderGateway(BACKEND_URL)
  const orderGateway = new InMemoryOrderGateway(new RealDateProvider())
  orderGateway.feedWith(...Object.values(orders))
  return orderGateway
}
