import { Timestamp, UUID } from '@core/types/types'

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
  Delivered
}

export interface OrderLine {
  name: string
  cip13: string
  unitAmount: number
  expectedQuantity: number
  preparedQuantity: number
  location: string
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
  AskToClient,
  WaitForRestock,
  PartialShip,
  CancelOrder
}

export interface Message {
  content: MessageContent
  sentAt: Timestamp
}

export interface Order {
  uuid: string
  lines: Array<OrderLine>
  deliveryAddress: Address
  payment: Payment
  createdAt: Timestamp
  contact: Contact
  delivery: OrderDelivery
  messages: Array<Message>
}
