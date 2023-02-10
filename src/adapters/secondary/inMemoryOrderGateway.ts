import { OrderGateway } from '@core/gateways/orderGateway'
import { DeliveryStatus, Order, PaymentStatus } from '@core/entities/order'

export class InMemoryOrderGateway implements OrderGateway {
  private orders: Array<Order> = []

  listOrdersToPrepare(): Promise<Array<Order>> {
    const toPrepare = this.orders.filter(
      (o) =>
        !o.lines.some((l) => l.deliveryStatus > DeliveryStatus.Created) &&
        o.payment.status > PaymentStatus.WaitingForPayment
    )
    return Promise.resolve(toPrepare)
  }

  feedWith(...orders: Array<Order>) {
    this.orders = orders
  }
}
