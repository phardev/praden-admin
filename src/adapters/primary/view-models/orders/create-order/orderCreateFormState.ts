import type { Customer } from '@core/entities/customer'
import type { Address, Contact, DeliveryMethod } from '@core/entities/order'
import type { Product } from '@core/entities/product'
import type { ProductPromotion } from '@core/entities/promotion'
import type { RelayPoint } from '@core/entities/relayPoint'
import type { Timestamp } from '@core/types/types'
import { ManualOrderPaymentMode } from '@core/usecases/order/manual-order-creation/createManualOrder'

export interface OrderCreateFormLine {
  product: Product
  quantity: number
  promotions?: Array<ProductPromotion>
}

export interface OrderCreateFormState {
  customer?: Customer
  lines: Array<OrderCreateFormLine>
  deliveryMethod?: DeliveryMethod
  selectedRelayPoint?: RelayPoint
  deliveryAddress: Address
  billingAddress: Address
  billingSameAsDelivery: boolean
  contact: Contact
  pickingDate?: Timestamp
  pickingHour?: string
  sendConfirmationEmail: boolean
  paymentMode: ManualOrderPaymentMode
}

export const emptyAddress = (): Address => {
  return {
    firstname: '',
    lastname: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  }
}

export const emptyOrderCreateFormState = (): OrderCreateFormState => {
  return {
    customer: undefined,
    lines: [],
    deliveryMethod: undefined,
    selectedRelayPoint: undefined,
    deliveryAddress: emptyAddress(),
    billingAddress: emptyAddress(),
    billingSameAsDelivery: true,
    contact: {
      email: '',
      phone: ''
    },
    pickingDate: undefined,
    pickingHour: undefined,
    sendConfirmationEmail: false,
    paymentMode: ManualOrderPaymentMode.AlreadyPaid
  }
}
