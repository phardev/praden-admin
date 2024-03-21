import { RealProductGateway } from '@adapters/secondary/product-gateways/RealProductGateway'

export const useProductGateway = () => {
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealProductGateway(BACKEND_URL)
}
