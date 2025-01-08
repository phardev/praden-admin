import { useSearchStore } from '@store/searchStore'

import { SearchGateway } from '@core/gateways/searchGateway'
import { ProductStatus } from '@core/entities/product'

export interface SearchProductsFilters {
  query?: string
  minimumQueryLength?: number
  status?: ProductStatus
}

export const searchProducts = async (
  from: string,
  filters: SearchProductsFilters,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(from, filters)
  if (filters.query && filters.query.length < filters.minimumQueryLength) {
    searchStore.setError(from, 'query is too short')
    searchStore.set(from, undefined)
  } else if (!filters.query && !filters.status) {
    searchStore.setError(from, undefined)
    searchStore.set(from, undefined)
  } else {
    const searchResult = await searchGateway.searchProducts(filters)
    searchStore.set(from, searchResult)
    searchStore.setError(from, undefined)
  }
  return Promise.resolve()
}
