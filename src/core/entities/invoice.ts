import { Order } from '@core/entities/order'
import { Timestamp } from '@core/types/types'

export interface Invoice {
  id: string
  data: Order
  createdAt: Timestamp
}
