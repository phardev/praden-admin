import { OrderGateway } from '@core/gateways/orderGateway'
import { DeliveryStatus, Order } from '@core/entities/order'

export class InMemoryOrderGateway implements OrderGateway {
  private orders: Array<Order> = []

  listOrdersToPrepare(): Promise<Array<Order>> {
    const toPrepare = this.orders.filter(
      (o) => !o.lines.some((l) => l.deliveryStatus > DeliveryStatus.Created)
    )
    return Promise.resolve(toPrepare)
  }

  feedWith(...orders: Array<Order>) {
    this.orders = orders
  }
}
