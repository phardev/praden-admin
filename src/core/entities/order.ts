import { Timestamp, UUID } from '@core/types/types'
import { addTaxToPrice } from '@utils/price'

export interface Address {
  firstname: string
  lastname: string
  address: string
  city: string
  zip: string
  appartement?: string
}

export enum DeliveryStatus {
  Created,
  Processing,
  Shipped,
  Delivered,
  Canceled
}

export interface OrderLine {
  name: string
  ean13: string
  unitAmount: number
  expectedQuantity: number
  preparedQuantity: number
  locations: object
  percentTaxRate: number
  deliveryStatus: DeliveryStatus
  updatedAt: Timestamp
}

export enum PaymentStatus {
  WaitingForPayment,
  Payed
}

export interface Payment {
  invoiceNumber?: string
  status: PaymentStatus
}

export interface Contact {
  email: string
  phone: string
}

export enum DeliveryType {
  ClickAndCollect,
  Delivery
}

export interface DeliveryMethod {
  uuid: UUID
  name: string
  description: string
  type: DeliveryType
  price: number
}

export interface OrderDelivery {
  method: DeliveryMethod
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
  payment: Payment
  createdAt: Timestamp
  delivery: OrderDelivery
  messages: Array<Message>
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
  const deliveryPrice = order.delivery.method.price / 100
  return totalLine + deliveryPrice
}

export const getDeliveryStatus = (order: Order): DeliveryStatus => {
  const statuses = order.lines.map((l) => l.deliveryStatus)
  return Math.min(...statuses)
}

export const isAnonymousOrder = (order: Order): order is AnonymousOrder => {
  return (order as CustomerOrder).customerUuid === undefined
}
