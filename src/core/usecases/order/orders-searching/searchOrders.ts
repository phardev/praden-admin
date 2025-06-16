import { useSearchStore } from '@store/searchStore'

import { SearchGateway } from '@core/gateways/searchGateway'
import { Timestamp, UUID } from '@core/types/types'
import { OrderLineStatus, PaymentStatus } from '@core/entities/order'
import { DeliveryStatus } from '@core/entities/delivery'

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
