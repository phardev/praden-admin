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
  quantity: number
  deliveryStatus: DeliveryStatus
}

export interface Order {
  uuid: string
  lines: Array<OrderLine>
  deliveryAddress: Address
}
