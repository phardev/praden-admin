import { Timestamp, UUID } from '@core/types/types'
import { addTaxToPrice } from '@utils/price'
import { Promotion } from '@core/entities/promotion'
import { Delivery } from '@core/entities/delivery'

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
}

export interface CustomerOrder extends BaseOrder {
  customerUuid: UUID
}

export interface AnonymousOrder extends BaseOrder {
  contact: Contact
}

export type Order = CustomerOrder | AnonymousOrder

// export const getTotalWithoutTax = (lines: Array<OrderLine>) => {
//   return lines.reduce((acc: number, line: OrderLine) => {
//     return acc + line.preparedQuantity * line.unitAmount
//   }, 0)
// }

export const getTotalWithTax = (order: Order): number => {
  const totalLine = order.lines.reduce((acc: number, line: OrderLine) => {
    return (
      acc +
      (line.expectedQuantity *
        addTaxToPrice(line.unitAmount, line.percentTaxRate)) /
        100
    )
  }, 0)
  const delivery = order.deliveries[0]
  const deliveryPrice = delivery.price / 100
  return totalLine + deliveryPrice
}

export const getDeliveryStatus = (order: Order): OrderLineStatus => {
  const statuses = order.lines.map((l) => l.status)
  return Math.min(...statuses)
}

export const isAnonymousOrder = (order: Order): order is AnonymousOrder => {
  return (order as CustomerOrder).customerUuid === undefined
}
