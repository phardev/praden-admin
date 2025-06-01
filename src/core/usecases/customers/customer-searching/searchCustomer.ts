import { SearchGateway } from '@core/gateways/searchGateway'
import { useSearchStore } from '@store/searchStore'
import { SearchDTO } from '@core/usecases/order/orders-searching/searchOrders'

export type SearchCustomersDTO = SearchDTO

export const searchCustomers = async (
  from: string,
  dto: Partial<SearchCustomersDTO>,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(from, dto)
  const searchResult = await searchGateway.searchCustomers(dto)
  searchStore.set(from, searchResult)
  return Promise.resolve()
}
