import { DeliveryStatus } from '@core/entities/delivery'
import { OrderLineStatus, PaymentStatus } from '@core/entities/order'
import { SearchGateway } from '@core/gateways/searchGateway'
import { Timestamp, UUID } from '@core/types/types'
import { useSearchStore } from '@store/searchStore'

export interface SearchDTO {
  query?: string
  minimumQueryLength?: number
}

export interface SearchOrdersDTO extends SearchDTO {
  startDate?: Timestamp
  endDate?: Timestamp
  orderStatus?: OrderLineStatus
  deliveryStatus?: DeliveryStatus
  paymentStatus?: PaymentStatus
  customerUuid?: UUID
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
  searchStore.startLoading(key)
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
  searchStore.endLoading(key)
}
