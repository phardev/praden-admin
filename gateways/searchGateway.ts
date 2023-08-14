import * as products from '@utils/testData/products'

import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'

export const useSearchGateway = () => {
  const searchGateway = new FakeSearchGateway()
  searchGateway.feedWith(...Object.values(products))
  return searchGateway
}
