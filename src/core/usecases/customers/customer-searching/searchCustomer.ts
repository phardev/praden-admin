import { SearchGateway } from '@core/gateways/searchGateway'
import { SearchDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { useSearchStore } from '@store/searchStore'

export type SearchCustomersDTO = SearchDTO

export const searchCustomers = async (
  from: string,
  dto: Partial<SearchCustomersDTO>,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(from, dto)
  if (
    dto.query &&
    dto.minimumQueryLength &&
    dto.query.length < dto.minimumQueryLength
  ) {
    searchStore.setError(from, 'query is too short')
    searchStore.set(from, [])
  } else {
    const searchResult = await searchGateway.searchCustomers(dto)
    searchStore.set(from, searchResult)
  }
  return Promise.resolve()
}
