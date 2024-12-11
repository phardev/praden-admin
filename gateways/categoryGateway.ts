import * as categories from '@utils/testData/categories'
import { RealCategoryGateway } from '@adapters/secondary/category-gateways/realCategoryGateway'
import { isLocalEnv } from '@utils/env'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryTimoutCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryTimoutCategoryGateway'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid')
const categoryGateway = new InMemoryTimoutCategoryGateway(500, uuidGenerator)
categoryGateway.feedWith(...Object.values(categories))

export const useCategoryGateway = () => {
  if (isLocalEnv()) {
    return categoryGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealCategoryGateway(BACKEND_URL)
}
