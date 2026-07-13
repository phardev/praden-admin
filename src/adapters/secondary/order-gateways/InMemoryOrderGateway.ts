import { RealUuidGenerator } from '@adapters/secondary/uuid-generators/RealUuidGenerator'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import {
  CustomerOrder,
  DeliveryMethod,
  DeliveryType,
  Message,
  MessageContent,
  Order,
  OrderLine,
  OrderLineStatus,
  Payment,
  PaymentStatus
} from '@core/entities/order'
import { Product } from '@core/entities/product'
import { OrderLineAlreadyProcessedError } from '@core/errors/OrderLineAlreadyProcessedError'
import { PreparationDoesNotExistsError } from '@core/errors/PreparationDoesNotExistsError'
import { ProductDoesNotExistsError } from '@core/errors/ProductDoesNotExistsError'
import { DateProvider } from '@core/gateways/dateProvider'
import { OrderGateway } from '@core/gateways/orderGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import {
  CreateManualOrderDTO,
  CreateManualOrderLineDTO,
  ManualOrderPaymentMode
} from '@core/usecases/order/manual-order-creation/createManualOrder'
import { addTaxToPrice } from '@utils/price'

const DELIVERY_TAX_RATE = 20

export class InMemoryOrderGateway implements OrderGateway {
  private orders: Array<Order> = []
  private products: Array<Product> = []
  private deliveryMethods: Array<DeliveryMethod> = []
  private printed: Array<UUID> = []
  private dateProvider: DateProvider
  private uuidGenerator: UuidGenerator

  constructor(
    dateProvider: DateProvider,
    uuidGenerator: UuidGenerator = new RealUuidGenerator()
  ) {
    this.dateProvider = dateProvider
    this.uuidGenerator = uuidGenerator
  }

  list(limit?: number, offset?: number): Promise<Array<Order>> {
    if (limit === undefined) {
      return Promise.resolve(this.orders)
    }
    const start = offset ?? 0
    return Promise.resolve(this.orders.slice(start, start + limit))
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

  async create(dto: CreateManualOrderDTO): Promise<Order> {
    const lines = dto.lines.map((line) => this.buildOrderLine(line))
    const delivery = this.buildDelivery(dto)
    const uuid = this.uuidGenerator.generate()
    const order: CustomerOrder = {
      uuid,
      customerUuid: dto.customerUuid,
      lines,
      deliveryAddress: dto.deliveryAddress,
      billingAddress: dto.billingAddress,
      payment: this.buildPayment(dto, lines, delivery, uuid),
      createdAt: this.dateProvider.now(),
      deliveries: [delivery],
      messages: []
    }
    this.orders.push(order)
    return Promise.resolve(JSON.parse(JSON.stringify(order)))
  }

  private buildPayment(
    dto: CreateManualOrderDTO,
    lines: Array<OrderLine>,
    delivery: Delivery,
    orderUuid: UUID
  ): Payment {
    const amount =
      this.computeLinesTotalWithTax(lines) +
      Math.round(addTaxToPrice(delivery.price, DELIVERY_TAX_RATE))
    if (dto.paymentMode === ManualOrderPaymentMode.PaymentPage) {
      return {
        status: PaymentStatus.WaitingForPayment,
        amount,
        paymentPageUrl: `https://payment.example/${orderUuid}`
      }
    }
    if (dto.paymentMode === ManualOrderPaymentMode.PaymentLink) {
      return { status: PaymentStatus.WaitingForPayment, amount }
    }
    return { status: PaymentStatus.Payed, amount }
  }

  private buildDelivery(dto: CreateManualOrderDTO): Delivery {
    const method = this.deliveryMethods.find(
      (m) => m.uuid === dto.deliveryMethodUuid
    )
    if (!method) {
      throw new Error(`Delivery method ${dto.deliveryMethodUuid} not found`)
    }
    const weight = this.computeTotalWeight(dto.lines)
    const delivery: Delivery = {
      uuid: this.uuidGenerator.generate(),
      price: this.computeDeliveryPrice(
        method,
        dto.deliveryAddress.country,
        weight
      ),
      method,
      weight,
      sender: { contact: dto.contact, address: dto.billingAddress },
      receiver: { contact: dto.contact, address: dto.deliveryAddress },
      status: DeliveryStatus.Created
    }
    if (dto.pickingDate !== undefined) {
      delivery.pickingDate = dto.pickingDate
    }
    return delivery
  }

  private computeTotalWeight(lines: Array<CreateManualOrderLineDTO>): number {
    return lines.reduce((acc, line) => {
      const product = this.products.find((p) => p.uuid === line.productUuid)
      return acc + (product?.weight ?? 0) * line.quantity
    }, 0)
  }

  private computeDeliveryPrice(
    method: DeliveryMethod,
    country: string,
    weight: number
  ): number {
    if (method.type === DeliveryType.ClickAndCollect) {
      return 0
    }
    const ranges = method.priceRanges[country.toUpperCase()] ?? []
    const matchingRange = ranges.find(
      (range) => weight >= range.minWeight && weight <= range.maxWeight
    )
    return matchingRange?.price ?? ranges[0]?.price ?? 0
  }

  private buildOrderLine(lineDTO: CreateManualOrderLineDTO): OrderLine {
    const product = this.products.find((p) => p.uuid === lineDTO.productUuid)
    if (!product) {
      throw new ProductDoesNotExistsError(lineDTO.productUuid)
    }
    return {
      productUuid: product.uuid,
      name: product.name,
      ean13: product.ean13,
      unitAmount: product.priceWithoutTax,
      expectedQuantity: lineDTO.quantity,
      preparedQuantity: 0,
      locations: product.locations,
      percentTaxRate: product.percentTaxRate,
      status: OrderLineStatus.Created,
      updatedAt: this.dateProvider.now()
    }
  }

  private computeLinesTotalWithTax(lines: Array<OrderLine>): number {
    return lines.reduce((acc, line) => {
      return (
        acc +
        Math.round(addTaxToPrice(line.unitAmount, line.percentTaxRate)) *
          line.expectedQuantity
      )
    }, 0)
  }

  listPrinted(): Array<UUID> {
    return this.printed
  }

  feedWith(...orders: Array<Order>) {
    this.orders = orders
  }

  feedWithProducts(...products: Array<Product>) {
    this.products = products
  }

  feedWithDeliveryMethods(...deliveryMethods: Array<DeliveryMethod>) {
    this.deliveryMethods = deliveryMethods
  }
}
