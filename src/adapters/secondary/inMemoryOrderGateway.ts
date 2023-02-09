import { OrderGateway } from '@core/gateways/orderGateway'
import { Order } from '@core/usecases/order/orders-to-prepare-listing/order'

export class InMemoryOrderGateway implements OrderGateway {
  private orders: Array<Order> = []

  listOrdersToPrepare(): Promise<Array<Order>> {
    return Promise.resolve(this.orders)
  }

  feedWith(...orders: Array<Order>) {
    this.orders = orders
  }
}
