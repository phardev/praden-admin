import { Timestamp } from '@core/types/types'

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
  quantity: number
  location: string
  percentTaxRate: number
  deliveryStatus: DeliveryStatus
}

export enum PaymentStatus {
  WaitingForPayment,
  Payed
}

export interface Payment {
  status: PaymentStatus
}

export interface Order {
  uuid: string
  lines: Array<OrderLine>
  deliveryAddress: Address
  payment: Payment
  createdAt: Timestamp
}
