import { useSearchStore } from '@store/searchStore'

import { SearchGateway } from '@core/gateways/searchGateway'

export interface SearchProductsFilters {
  query?: string
  minimumQueryLength?: number
}

export const searchProducts = async (
  from: string,
  filters: SearchProductsFilters,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(from, filters.query)
  if (filters.query && filters.query.length < filters.minimumQueryLength) {
    searchStore.setError(from, 'query is too short')
    searchStore.set(from, undefined)
  } else if (!filters.query) {
    searchStore.setError(from, undefined)
    searchStore.set(from, undefined)
  } else {
    const searchResult = await searchGateway.searchProducts(filters.query)
    searchStore.set(from, searchResult)
    searchStore.setError(from, undefined)
  }
  return Promise.resolve()
}
