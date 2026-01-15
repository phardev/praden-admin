import { ProductStatus } from '@core/entities/product'
import { SearchGateway } from '@core/gateways/searchGateway'
import { useSearchStore } from '@store/searchStore'

export interface SearchProductsFilters {
  query?: string
  minimumQueryLength?: number
  status?: ProductStatus
  size?: number
  from?: number
}

export const searchProducts = async (
  key: string,
  filters: SearchProductsFilters,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(key, filters)
  if (
    filters.query &&
    filters.minimumQueryLength &&
    filters.query.length < filters.minimumQueryLength
  ) {
    searchStore.setError(key, 'query is too short')
    searchStore.set(key, [])
    searchStore.setPagination(key, { total: 0, from: 0, hasMore: false })
    searchStore.endLoading(key)
  } else if (!filters.query && !filters.status) {
    searchStore.clear(key)
    searchStore.setError(key, undefined)
    searchStore.endLoading(key)
  } else {
    searchStore.startLoading(key)
    const searchResult = await searchGateway.searchProducts(filters)
    const isAppending = (filters.from ?? 0) > 0
    if (isAppending) {
      searchStore.append(key, searchResult.items)
    } else {
      searchStore.set(key, searchResult.items)
    }
    searchStore.setPagination(key, {
      total: searchResult.pagination.total,
      from: filters.from ?? 0,
      hasMore: searchResult.hasMore
    })
    searchStore.setError(key, undefined)
    searchStore.endLoading(key)
  }
  return Promise.resolve()
}
