import { OrderGateway } from '@core/gateways/orderGateway'
import {
  DeliveryStatus,
  Message,
  Order,
  OrderLine,
  PaymentStatus
} from '@core/entities/order'
import { UUID } from '@core/types/types'
import { PreparationDoesNotExistsError } from '@core/errors/preparationDoesNotExistsError'
import { DateProvider } from '@core/gateways/dateProvider'
import { OrderLineAlreadyProcessedError } from '@core/errors/OrderLineAlreadyProcessedError'

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
    const diffLines: Array<OrderLine> = []
    preparation.lines.forEach((line) => {
      if (line.preparedQuantity !== line.expectedQuantity) {
        if (line.preparedQuantity === 0)
          line.deliveryStatus = DeliveryStatus.Canceled
        else line.deliveryStatus = DeliveryStatus.Shipped
        diffLines.push({
          ...line,
          preparedQuantity: 0,
          expectedQuantity: line.preparedQuantity - line.expectedQuantity,
          deliveryStatus: DeliveryStatus.Canceled,
          updatedAt: this.dateProvider.now()
        })
      } else {
        line.deliveryStatus = DeliveryStatus.Shipped
      }
      line.updatedAt = this.dateProvider.now()
    })
    preparation.lines.push(...diffLines)
    let order: Order = await this.getByUuid(preparation.uuid)
    order = preparation
    return Promise.resolve(order)
  }

  async savePreparation(preparation: Order): Promise<Order> {
    const index = this.orders.findIndex((o) => o.uuid === preparation.uuid)
    if (index < 0) {
      throw new PreparationDoesNotExistsError(preparation.uuid)
    }
    preparation.lines.forEach((l, lineIndex) => {
      const currentLine = this.orders[index].lines[lineIndex]
      if (l.preparedQuantity !== currentLine.preparedQuantity) {
        if (currentLine.deliveryStatus > DeliveryStatus.Processing)
          throw new OrderLineAlreadyProcessedError()
        l.updatedAt = this.dateProvider.now()
      }
      if (l.deliveryStatus < DeliveryStatus.Processing)
        l.deliveryStatus = DeliveryStatus.Processing
    })
    this.orders.splice(index, 1, preparation)
    return Promise.resolve(preparation)
  }

  async addMessage(order: Order, message: Message): Promise<Order> {
    order.messages.push(message)
    const index = this.orders.findIndex((o) => o.uuid === order.uuid)
    if (index < 0) throw new PreparationDoesNotExistsError(order.uuid)
    this.orders.splice(index, 1, order)
    return Promise.resolve(order)
  }

  feedWith(...orders: Array<Order>) {
    this.orders = orders
  }
}
