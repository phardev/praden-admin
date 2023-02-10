import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'
import * as orders from '@utils/testData/orders'

export const useOrderGateway = () => {
  const orderGateway = new InMemoryOrderGateway()
  orderGateway.feedWith(...Object.values(orders))
  return orderGateway
}
