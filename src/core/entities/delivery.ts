import { Address, Contact, DeliveryMethod } from '@core/entities/order'
import { Timestamp } from '@core/types/types'

export enum DeliveryStatus {
  Created,
  Prepared,
  Shipped,
  Delivered
}

export interface Delivery {
  uuid: string
  price: number
  pickupId?: string
  trackingNumber?: string
  pickingDate?: Timestamp
  method: DeliveryMethod
  weight: number
  sender: {
    contact: Contact
    address: Address
  }
  receiver: {
    contact: Contact
    address: Address
  }
  status: DeliveryStatus
}
