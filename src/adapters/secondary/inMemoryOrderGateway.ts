import { OrderGateway } from '@core/gateways/orderGateway'
import { DeliveryStatus, Order, PaymentStatus } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { PreparationDoesNotExistsError } from '@core/errors/preparationDoesNotExistsError'

export class InMemoryOrderGateway implements OrderGateway {
  private orders: Array<Order> = []

  list(): Promise<Array<Order>> {
    return Promise.resolve(this.orders)
  }

  listOrdersToPrepare(): Promise<Array<Order>> {
    const toPrepare = this.orders.filter(
      (o) =>
        !o.lines.some((l) => l.deliveryStatus > DeliveryStatus.Created) &&
        o.payment.status > PaymentStatus.WaitingForPayment
    )
    return Promise.resolve(toPrepare)
  }

  startPreparation(uuid: UUID): void {
    const order = this.orders.find((o) => o.uuid === uuid)
    order?.lines.forEach((l) => {
      l.deliveryStatus = DeliveryStatus.Processing
    })
  }

  getByUuid(uuid: UUID): Promise<Order> {
    const order = this.orders.find((o) => o.uuid === uuid)
    if (!order) {
      throw new PreparationDoesNotExistsError(uuid)
    }
    return Promise.resolve(order)
  }

  async update(updated: Order): Promise<Order> {
    let order = await this.getByUuid(updated.uuid)
    order = updated
    return Promise.resolve(order)
  }

  feedWith(...orders: Array<Order>) {
    this.orders = orders
  }
}
