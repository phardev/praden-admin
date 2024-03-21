import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import * as categories from '@utils/testData/categories'

export const useCategoryGateway = () => {
  const categoryGateway = new InMemoryCategoryGateway()
  categoryGateway.feedWith(...Object.values(categories))
  return categoryGateway
}
