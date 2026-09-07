import { DeliveryStatus } from '@core/entities/delivery'
import { OrderLineStatus, PaymentStatus } from '@core/entities/order'
import { SearchGateway } from '@core/gateways/searchGateway'
import { Timestamp, UUID } from '@core/types/types'
import { useSearchStore } from '@store/searchStore'

export interface SearchDTO {
  query?: string
  minimumQueryLength?: number
}

export type TotalTtcOperator = 'lte' | 'eq' | 'gte'

export interface TotalTtcCondition {
  operator: TotalTtcOperator
  value: number
}

export interface SearchOrdersDTO extends SearchDTO {
  startDate?: Timestamp
  endDate?: Timestamp
  orderStatus?: OrderLineStatus
  deliveryStatus?: DeliveryStatus
  paymentStatus?: PaymentStatus
  customerUuid?: UUID
  totalTtcConditions?: Array<TotalTtcCondition>
  size?: number
  from?: number
}

const DEFAULT_PAGE_SIZE = 25

export const searchOrders = async (
  key: string,
  dto: SearchOrdersDTO,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(key, dto)
  if (isQueryTooShort(dto)) {
    searchStore.setError(key, 'query is too short')
    searchStore.set(key, [])
    searchStore.setPagination(key, { total: 0, from: 0, hasMore: false })
    searchStore.endLoading(key)
    return
  }
  searchStore.startLoading(key)
  try {
    const items = await searchGateway.searchOrders(dto)
    const offset = dto.from ?? 0
    const size = dto.size ?? DEFAULT_PAGE_SIZE
    if (offset > 0) {
      searchStore.append(key, items)
    } else {
      searchStore.set(key, items)
    }
    searchStore.setPagination(key, {
      total: items.length + offset,
      from: offset,
      hasMore: items.length === size
    })
    searchStore.setError(key, undefined)
  } finally {
    searchStore.endLoading(key)
  }
}

const isQueryTooShort = (dto: SearchOrdersDTO): boolean =>
  !!dto.query &&
  !!dto.minimumQueryLength &&
  dto.query.length < dto.minimumQueryLength
