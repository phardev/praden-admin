import { InMemoryProductGateway } from '@adapters/secondary/inMemoryProductGateway'
import * as products from '@utils/testData/productsDemoPraden'

export const useProductGateway = () => {
  const productGateway = new InMemoryProductGateway()
  productGateway.feedWith(...Object.values(products))
  return productGateway
}
