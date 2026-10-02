import { SearchGateway } from '@core/gateways/searchGateway'
import { Timestamp } from '@core/types/types'
import { SearchDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { useSearchStore } from '@store/searchStore'

export interface SearchCustomersDTO extends SearchDTO {
  lastOrderStartDate?: Timestamp
  lastOrderEndDate?: Timestamp
  minOrdersCount?: number
  maxOrdersCount?: number
  newsletterSubscribed?: boolean
  size?: number
  from?: number
}

export const searchCustomers = async (
  from: string,
  dto: Partial<SearchCustomersDTO>,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(from, dto)
  if (isQueryTooShort(dto)) {
    searchStore.setError(from, 'query is too short')
    searchStore.set(from, [])
    searchStore.setPagination(from, { total: 0, from: 0, hasMore: false })
    searchStore.endLoading(from)
    return
  }
  searchStore.startLoading(from)
  try {
    const customers = await searchGateway.searchCustomers(dto)
    const offset = dto.from ?? 0
    if (offset > 0) {
      searchStore.append(from, customers)
    } else {
      searchStore.set(from, customers)
    }
    searchStore.setPagination(from, {
      total: customers.length + offset,
      from: offset,
      hasMore: dto.size !== undefined && customers.length === dto.size
    })
    searchStore.setError(from, undefined)
  } finally {
    searchStore.endLoading(from)
  }
}

const isQueryTooShort = (dto: Partial<SearchCustomersDTO>): boolean =>
  !!dto.query &&
  !!dto.minimumQueryLength &&
  dto.query.length < dto.minimumQueryLength
