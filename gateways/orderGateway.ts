import { RealOrderGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import * as orders from '@utils/testData/orders'

const orderGateway = new InMemoryOrderGateway(new RealDateProvider())
orderGateway.feedWith(...Object.values(orders))

export const useOrderGateway = () => {
  // const { BACKEND_URL } = useRuntimeConfig().public
  // return new RealOrderGateway(BACKEND_URL)
  return orderGateway
}
