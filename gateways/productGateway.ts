import { InMemoryProductGateway } from '@adapters/secondary/inMemoryProductGateway'
import { dolodent, ultraLevure } from '@utils/testData/products'

export const useProductGateway = () => {
  const productGateway = new InMemoryProductGateway()
  productGateway.feedWith(dolodent, ultraLevure)
  return productGateway
}
