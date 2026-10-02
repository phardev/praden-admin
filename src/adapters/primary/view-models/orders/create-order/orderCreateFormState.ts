import type { Customer } from '@core/entities/customer'
import {
  type Address,
  CollectionPlace,
  type Contact,
  type DeliveryMethod
} from '@core/entities/order'
import type { Product } from '@core/entities/product'
import type { ProductPromotion } from '@core/entities/promotion'
import type { RelayPoint } from '@core/entities/relayPoint'
import type { Timestamp, UUID } from '@core/types/types'
import { ManualOrderPaymentMode } from '@core/usecases/order/manual-order-creation/createManualOrder'

export interface OrderCreateFormLine {
  product: Product
  quantity: number
  promotions?: Array<ProductPromotion>
}

export interface OrderCreateFormPromotionCode {
  code: string
  discount: number
  basis: string
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
  voucherCode: string
  promotionCode?: OrderCreateFormPromotionCode
  customerMessage?: string
  cartUuid?: UUID
  cartOwnedBy?: UUID
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

export const customerPrefilledAddress = (customer: Customer): Address => {
  return customer.address
    ? { ...emptyAddress(), ...customer.address }
    : {
        ...emptyAddress(),
        firstname: customer.firstname,
        lastname: customer.lastname
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
    paymentMode: ManualOrderPaymentMode.AlreadyPaid,
    voucherCode: ''
  }
}

export const canChangeCustomer = (formState: OrderCreateFormState): boolean => {
  return !formState.cartOwnedBy
}

const isBlankAddress = (address: Address): boolean =>
  JSON.stringify(address) === JSON.stringify(emptyAddress())

const keepsCartDetails = (formState: OrderCreateFormState): boolean =>
  formState.cartUuid !== undefined

const addressWithCustomer = (
  formState: OrderCreateFormState,
  address: Address,
  customer: Customer
): Address =>
  keepsCartDetails(formState) && !isBlankAddress(address)
    ? { ...address }
    : customerPrefilledAddress(customer)

const contactWithCustomer = (
  formState: OrderCreateFormState,
  customer: Customer
): Contact =>
  keepsCartDetails(formState) && formState.contact.email
    ? { ...formState.contact }
    : { email: customer.email, phone: customer.phone ?? '' }

export const withCustomer = (
  formState: OrderCreateFormState,
  customer: Customer
): OrderCreateFormState => ({
  ...formState,
  customer,
  contact: contactWithCustomer(formState, customer),
  deliveryAddress: addressWithCustomer(
    formState,
    formState.deliveryAddress,
    customer
  ),
  billingAddress: addressWithCustomer(
    formState,
    formState.billingAddress,
    customer
  )
})

const isRelayAddress = (address: Address, relayPoint: RelayPoint): boolean =>
  address.address === relayPoint.address &&
  address.zip === relayPoint.zipCode &&
  address.city === relayPoint.city

const deliveryAddressLeavingRelay = (
  formState: OrderCreateFormState,
  deliveryMethod?: DeliveryMethod
): Address => {
  const relayPoint = formState.selectedRelayPoint
  if (
    !formState.customer ||
    !relayPoint ||
    deliveryMethod?.collectionPlace === CollectionPlace.PickupPoint ||
    !isRelayAddress(formState.deliveryAddress, relayPoint)
  ) {
    return formState.deliveryAddress
  }
  return customerPrefilledAddress(formState.customer)
}

export const withDeliveryMethod = (
  formState: OrderCreateFormState,
  deliveryMethod?: DeliveryMethod
): OrderCreateFormState => {
  if (deliveryMethod?.uuid === formState.deliveryMethod?.uuid) {
    return { ...formState, deliveryMethod }
  }
  return {
    ...formState,
    deliveryMethod,
    selectedRelayPoint: undefined,
    deliveryAddress: deliveryAddressLeavingRelay(formState, deliveryMethod)
  }
}
