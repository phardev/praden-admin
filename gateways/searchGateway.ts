import * as products from '@utils/testData/products'
import * as categories from '@utils/testData/categories'

import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'

export const useSearchGateway = () => {
  const searchGateway = new FakeSearchGateway()
  searchGateway.feedWith(
    ...Object.values(products),
    ...Object.values(categories)
  )
  return searchGateway
}
