import { RealProductGateway } from '@adapters/secondary/product-gateways/RealProductGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import * as products from '@utils/testData/products'
import { isLocalEnv } from '@utils/env'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid-123')
const inMemoryGateway = new InMemoryProductGateway(uuidGenerator)
inMemoryGateway.feedWith(...Object.values(products))

export const useProductGateway = () => {
  if (isLocalEnv()) {
    return inMemoryGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealProductGateway(BACKEND_URL)
}
