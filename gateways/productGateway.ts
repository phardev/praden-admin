import { RealProductGateway } from '@adapters/secondary/product-gateways/RealProductGateway'

export const useProductGateway = () => {
  // const productGateway = new InMemoryProductGateway()
  // productGateway.feedWith(...Object.values(products))
  // return productGateway
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealProductGateway(BACKEND_URL)
}
