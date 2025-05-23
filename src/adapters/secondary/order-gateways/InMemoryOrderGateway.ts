import { OrderGateway } from '@core/gateways/orderGateway'
import {
  OrderLineStatus,
  Message,
  MessageContent,
  Order,
  OrderLine,
  PaymentStatus
} from '@core/entities/order'
import { UUID } from '@core/types/types'
import { PreparationDoesNotExistsError } from '@core/errors/PreparationDoesNotExistsError'
import { DateProvider } from '@core/gateways/dateProvider'
import { OrderLineAlreadyProcessedError } from '@core/errors/OrderLineAlreadyProcessedError'

export class InMemoryOrderGateway implements OrderGateway {
  private orders: Array<Order> = []
  private printed: Array<UUID> = []
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
        !o.lines.every((l) => l.status >= OrderLineStatus.Prepared) &&
        o.payment &&
        o.payment.status > PaymentStatus.WaitingForPayment
    )
    return Promise.resolve(toPrepare)
  }

  startPreparation(uuid: UUID): Promise<Order> {
    const order = this.orders.find((o) => o.uuid === uuid)
    if (!order) {
      throw new PreparationDoesNotExistsError(uuid)
    }
    order?.lines.forEach((l) => {
      l.status = OrderLineStatus.Started
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
    this.shipOrCancelLines(preparation.lines)
    this.createDiffBetweenExpectedAndPrepared(preparation.lines)
    const index = this.orders.findIndex((o) => o.uuid === preparation.uuid)
    this.orders.splice(index, 1, preparation)
    return Promise.resolve(preparation)
  }

  private shipOrCancelLines(lines: Array<OrderLine>) {
    lines.forEach((l) => {
      if (l.preparedQuantity === 0) l.status = OrderLineStatus.Canceled
      else l.status = OrderLineStatus.Prepared
      l.updatedAt = this.dateProvider.now()
    })
  }

  private createDiffBetweenExpectedAndPrepared(lines: Array<OrderLine>) {
    const diffLines: Array<OrderLine> = []
    lines.forEach((line) => {
      if (line.preparedQuantity !== line.expectedQuantity) {
        diffLines.push({
          ...line,
          preparedQuantity: 0,
          expectedQuantity: line.preparedQuantity - line.expectedQuantity,
          status: OrderLineStatus.Canceled,
          updatedAt: this.dateProvider.now()
        })
      }
    })
    lines.push(...diffLines)
  }

  async savePreparation(preparation: Order): Promise<Order> {
    const index = this.orders.findIndex((o) => o.uuid === preparation.uuid)
    if (index < 0) {
      throw new PreparationDoesNotExistsError(preparation.uuid)
    }
    preparation.lines.forEach((l, lineIndex) => {
      const currentLine = this.orders[index].lines[lineIndex]
      if (l.preparedQuantity !== currentLine.preparedQuantity) {
        if (currentLine.status > OrderLineStatus.Started)
          throw new OrderLineAlreadyProcessedError()
        l.updatedAt = this.dateProvider.now()
      }
      if (l.status < OrderLineStatus.Started) l.status = OrderLineStatus.Started
    })
    this.orders.splice(index, 1, preparation)
    return Promise.resolve(preparation)
  }

  async askHowToFinish(order: Order): Promise<Order> {
    const message: Message = {
      content: MessageContent.AskToClient,
      sentAt: this.dateProvider.now()
    }
    order.messages.push(message)
    const index = this.orders.findIndex((o) => o.uuid === order.uuid)
    if (index < 0) throw new PreparationDoesNotExistsError(order.uuid)
    this.orders.splice(index, 1, order)
    return Promise.resolve(order)
  }

  async cancelPreparation(preparation: Order): Promise<Order> {
    preparation.lines.forEach((l) => {
      l.preparedQuantity = 0
    })
    this.shipOrCancelLines(preparation.lines)
    this.createDiffBetweenExpectedAndPrepared(preparation.lines)
    const index = this.orders.findIndex((o) => o.uuid === preparation.uuid)
    this.orders.splice(index, 1, preparation)
    return Promise.resolve(preparation)
  }

  async batch(uuids: Array<UUID>): Promise<Array<Order>> {
    const res = this.orders.filter((o) => uuids.includes(o.uuid))
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  listPrinted(): Array<UUID> {
    return this.printed
  }

  feedWith(...orders: Array<Order>) {
    this.orders = orders
  }
}
