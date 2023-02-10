import { Order } from '@core/entities/order'

export interface OrderGateway {
  listOrdersToPrepare(): Promise<Array<Order>>
}
