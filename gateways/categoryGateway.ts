import * as categories from '@utils/testData/categoriesDemoPraden'
import { InMemoryCategoryGateway } from '@adapters/secondary/inMemoryCategoryGateway'

export const useCategoryGateway = () => {
  const categoryGateway = new InMemoryCategoryGateway()
  categoryGateway.feedWith(...Object.values(categories))
  return categoryGateway
}
