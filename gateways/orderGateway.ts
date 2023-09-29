import { RealOrderGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'

export const useOrderGateway = () => {
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealOrderGateway(BACKEND_URL)
  // const orderGateway = new InMemoryOrderGateway(new RealDateProvider())
  // orderGateway.feedWith(...Object.values(orders))
  // return orderGateway
}
