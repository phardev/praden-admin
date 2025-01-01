import { Address, Contact, DeliveryMethod } from '@core/entities/order'

export interface Delivery {
  uuid: string
  price: number
  pickupId?: string
  trackingNumber?: string
  method: DeliveryMethod
  sender: {
    contact: Contact
    address: Address
  }
  receiver: {
    contact: Contact
    address: Address
  }
}
