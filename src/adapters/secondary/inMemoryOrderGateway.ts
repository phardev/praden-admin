import { OrderGateway } from '@core/gateways/orderGateway'
import { DeliveryStatus, Order, PaymentStatus } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { PreparationDoesNotExistsError } from '@core/errors/preparationDoesNotExistsError'
import { DateProvider } from '@core/gateways/dateProvider'

export class InMemoryOrderGateway implements OrderGateway {
  private orders: Array<Order> = []
  private dateProvider: DateProvider

  constructor(dateProvider: DateProvider) {
    this.dateProvider = dateProvider
  }

  list(): Promise<Array<Order>> {
    return Promise.resolve(this.orders)
  }

  listOrdersToPrepare(): Promise<Array<Order>> {
    const toPrepare = this.orders.filter(
      (o) =>
        !o.lines.every((l) => l.deliveryStatus >= DeliveryStatus.Shipped) &&
        o.payment.status > PaymentStatus.WaitingForPayment
    )
    return Promise.resolve(toPrepare)
  }

  startPreparation(uuid: UUID): Promise<Order> {
    const order = this.orders.find((o) => o.uuid === uuid)
    order?.lines.forEach((l) => {
      l.deliveryStatus = DeliveryStatus.Processing
    })
    return Promise.resolve(order)
  }

  getByUuid(uuid: UUID): Promise<Order> {
    const order = this.orders.find((o) => o.uuid === uuid)
    if (!order) {
      throw new PreparationDoesNotExistsError(uuid)
    }
    return Promise.resolve(order)
  }

  async validatePreparation(preparation: Order): Promise<Order> {
    preparation.lines.forEach((line) => {
      line.deliveryStatus = DeliveryStatus.Shipped
      line.updatedAt = this.dateProvider.now()
    })
    let order: Order = await this.getByUuid(preparation.uuid)
    order = preparation
    return Promise.resolve(order)
  }

  feedWith(...orders: Array<Order>) {
    this.orders = orders
  }
}
