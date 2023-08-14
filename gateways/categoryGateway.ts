import * as categories from '@utils/testData/categories'
import { InMemoryCategoryGateway } from '@adapters/secondary/InMemoryCategoryGateway'

export const useCategoryGateway = () => {
  const categoryGateway = new InMemoryCategoryGateway()
  categoryGateway.feedWith(...Object.values(categories))
  return categoryGateway
}
