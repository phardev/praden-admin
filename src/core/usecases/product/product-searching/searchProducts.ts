import { useSearchStore } from '@store/searchStore'

import { SearchGateway } from '@core/gateways/searchGateway'

export const searchProducts = async (
  from: string,
  query: string,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(from, query)
  const searchResult = await searchGateway.searchProducts(query)
  searchStore.set(from, searchResult)
  return Promise.resolve()
}
