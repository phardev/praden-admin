import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'
import { RealSearchGateway } from '@adapters/secondary/search-gateways/RealSearchGateway'
import { isLocalEnv } from '@utils/env'
import * as categories from '@utils/testData/categories'
import * as products from '@utils/testData/products'

export const useSearchGateway = () => {
  if (isLocalEnv()) {
    const searchGateway = new FakeSearchGateway()
    searchGateway.feedWith(
      ...Object.values(products),
      ...Object.values(categories)
    )
    return searchGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealSearchGateway(BACKEND_URL)
}
