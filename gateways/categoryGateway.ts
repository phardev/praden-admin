import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import * as categories from '@utils/testData/categories'
import { RealCategoryGateway } from '@adapters/secondary/category-gateways/realCategoryGateway'
import { isLocalEnv } from '@utils/env'

export const useCategoryGateway = () => {
  if (isLocalEnv()) {
    const categoryGateway = new InMemoryCategoryGateway()
    categoryGateway.feedWith(...Object.values(categories))
    return categoryGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealCategoryGateway(BACKEND_URL)
}
