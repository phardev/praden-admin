import { Timestamp, UUID } from '@core/types/types'
import { addTaxToPrice } from '@utils/price'
import { Promotion } from '@core/entities/promotion'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import { Carrier } from './carrier'

export interface Address {
  firstname: string
  lastname: string
  address: string
  city: string
  zip: string
  country: string
  appartement?: string
}

export enum OrderLineStatus {
  Created,
  Started,
  Prepared,
  Canceled
}

export interface OrderLine {
  productUuid: UUID
  name: string
  ean13: string
  unitAmount: number
  expectedQuantity: number
  preparedQuantity: number
  locations: object
  percentTaxRate: number
  status: OrderLineStatus
  promotion?: Promotion
  updatedAt: Timestamp
}

export enum PaymentStatus {
  WaitingForPayment,
  Payed,
  Rejected
}

export interface Payment {
  status: PaymentStatus
  amount?: number
}

export interface Contact {
  email: string
  phone: string
}

export enum DeliveryType {
  ClickAndCollect = 'CLICKANDCOLLECT',
  Delivery = 'DELIVERY'
}

export interface PriceWeightRange {
  minWeight: number
  maxWeight: number
  price: number
}

export interface DeliveryMethod {
  uuid: UUID
  name: string
  description: string
  type: DeliveryType
  carrier: Carrier
  priceRanges: Array<PriceWeightRange>
}

export enum MessageContent {
  AskToClient = 'ASK_TO_CLIENT',
  WaitForRestock = 'WAIT_FOR_RESTOCK',
  PartialShip = 'PARTIAL_SHIP',
  CancelOrder = 'CANCEL_ORDER'
}

export interface Message {
  content: MessageContent
  sentAt: Timestamp
}

export interface PromotionCode {
  uuid: string
  code: string
  discount: number
}

export interface BaseOrder {
  uuid: string
  lines: Array<OrderLine>
  deliveryAddress: Address
  billingAddress: Address
  payment?: Payment
  createdAt: Timestamp
  deliveries: Array<Delivery>
  messages: Array<Message>
  invoiceNumber?: string
  customerMessage?: string
  promotionCode?: PromotionCode
}

export interface CustomerOrder extends BaseOrder {
  customerUuid: UUID
}

export interface AnonymousOrder extends BaseOrder {
  contact: Contact
}

export type Order = CustomerOrder | AnonymousOrder

export const getTotalWithTax = (order: Order): number => {
  const totalLine = order.lines.reduce((acc: number, line: OrderLine) => {
    return (
      acc +
      (line.expectedQuantity *
        Math.round(addTaxToPrice(line.unitAmount, line.percentTaxRate))) /
        100
    )
  }, 0)
  const delivery = order.deliveries[0]
  const deliveryPrice = addTaxToPrice(delivery.price, 20) / 100

  let total = totalLine + deliveryPrice

  if (order.promotionCode) {
    total = Math.max(0, total - order.promotionCode.discount / 100)
  }

  return total
}

export const getDeliveryStatus = (order: Order): DeliveryStatus => {
  if (!order.deliveries.length) {
    return DeliveryStatus.Created
  }
  return order.deliveries[0].status
}

export const getOrderStatus = (order: Order): OrderLineStatus => {
  const statuses = order.lines.map((l) => l.status)
  return Math.min(...statuses)
}

export const isAnonymousOrder = (order: Order): order is AnonymousOrder => {
  return (order as CustomerOrder).customerUuid === undefined
}
