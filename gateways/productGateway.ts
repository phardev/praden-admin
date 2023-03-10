import { InMemoryProductGateway } from '@adapters/secondary/inMemoryProductGateway'
import * as products from '@utils/testData/products'

export const useProductGateway = () => {
  const productGateway = new InMemoryProductGateway()
  console.log('feed', ...Object.values(products))
  productGateway.feedWith(...Object.values(products))
  return productGateway
}
