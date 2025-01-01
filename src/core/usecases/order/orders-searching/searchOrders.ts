import { useSearchStore } from '@store/searchStore'

import { SearchGateway } from '@core/gateways/searchGateway'
import { Timestamp, UUID } from '@core/types/types'
import { OrderLineStatus, PaymentStatus } from '@core/entities/order'

export interface SearchDTO {
  query?: string
}

export interface SearchOrdersDTO extends SearchDTO {
  startDate?: Timestamp
  endDate?: Timestamp
  deliveryStatus?: OrderLineStatus
  paymentStatus?: PaymentStatus
  customerUuid?: UUID
}

export const searchOrders = async (
  from: string,
  dto: SearchOrdersDTO,
  searchGateway: SearchGateway
): Promise<void> => {
  const searchStore = useSearchStore()
  searchStore.setFilter(from, dto)
  const searchResult = await searchGateway.searchOrders(dto)
  searchStore.set(from, searchResult)
  return Promise.resolve()
}
