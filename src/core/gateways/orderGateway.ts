import { Order } from '@core/usecases/order/orders-to-prepare-listing/order'

export interface OrderGateway {
  listOrdersToPrepare(): Promise<Array<Order>>
}
