import { Order } from '@core/entities/order'

export interface Invoice {
  id: string
  data: Order
}
