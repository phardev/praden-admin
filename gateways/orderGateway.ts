import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'
import * as orders from '@utils/testData/orders'
import { RealDateProvider } from '@adapters/secondary/realDateProvider'

export const useOrderGateway = () => {
  // const { BACKEND_URL } = useRuntimeConfig()
  // return new RealOrderGateway(BACKEND_URL)
  const orderGateway = new InMemoryOrderGateway(new RealDateProvider())
  orderGateway.feedWith(...Object.values(orders))
  return orderGateway
}
