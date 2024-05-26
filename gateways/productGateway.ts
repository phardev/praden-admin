import { RealProductGateway } from '@adapters/secondary/product-gateways/RealProductGateway'
import * as products from '@utils/testData/products'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'

const inMemoryGateway = new InMemoryProductGateway()
inMemoryGateway.feedWith(...Object.values(products))

export const useProductGateway = () => {
  return inMemoryGateway
  // const { BACKEND_URL } = useRuntimeConfig().public
  // return new RealProductGateway(BACKEND_URL)
}
