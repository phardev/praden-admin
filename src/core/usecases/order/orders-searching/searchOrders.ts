import { useSearchStore } from '@store/searchStore'

import { SearchGateway } from '@core/gateways/searchGateway'
import { Timestamp } from '@core/types/types'
import { DeliveryStatus, PaymentStatus } from '@core/entities/order'

export interface SearchDTO {
  query?: string
}

export interface SearchOrdersDTO extends SearchDTO {
  startDate?: Timestamp
  endDate?: Timestamp
  deliveryStatus?: DeliveryStatus
  paymentStatus?: PaymentStatus
}

export const searchOrders = async (
  from: string,
  dto: SearchOrdersDTO,
  searchGateway: SearchGateway
): Promise<void> => {
  console.log('search with dto: ', dto)
  const searchStore = useSearchStore()
  searchStore.setFilter(from, dto)
  const searchResult = await searchGateway.searchOrders(dto)
  searchStore.set(from, searchResult)
  return Promise.resolve()
}
