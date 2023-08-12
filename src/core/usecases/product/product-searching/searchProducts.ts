import { useSearchStore } from '@store/searchStore'

import { SearchGateway } from '@core/gateways/searchGateway'

export const searchProducts = async (
  from: string,
  query: string,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchResult = await searchGateway.searchProducts(query)
  const searchStore = useSearchStore()
  searchStore.set(from, searchResult)
  return Promise.resolve()
}
