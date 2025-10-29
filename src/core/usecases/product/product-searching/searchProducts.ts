import { ProductStatus } from '@core/entities/product'
import { SearchGateway } from '@core/gateways/searchGateway'
import { useSearchStore } from '@store/searchStore'

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
  if (
    filters.query &&
    filters.minimumQueryLength &&
    filters.query.length < filters.minimumQueryLength
  ) {
    searchStore.setError(from, 'query is too short')
    searchStore.set(from, [])
    searchStore.endLoading(from)
  } else if (!filters.query && !filters.status) {
    searchStore.clear(from)
    searchStore.setError(from, undefined)
    searchStore.endLoading(from)
  } else {
    searchStore.startLoading(from)
    const searchResult = await searchGateway.searchProducts(filters)
    searchStore.set(from, searchResult)
    searchStore.setError(from, undefined)
    searchStore.endLoading(from)
  }
  return Promise.resolve()
}
