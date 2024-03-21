import type { Mail } from '@core/types/types'

export interface PreparationStartedShippingAddress
  extends PreparationStartedBillingAddress {
  link: string
}

export interface PreparationStartedBillingAddress {
  firstname: string
  lastname: string
  address: string
  phone: string
}

export interface PreparationStartedLinesData {
  img: string
  name: string
  unitPrice: string
  quantity: number
  total: string
}

export interface PreparationStartedTotalData {
  productPrice: string
  shippingPrice: string
  price: string
}

export interface PreparationStartedMessage {
  to: Mail
  shippingAddress: PreparationStartedShippingAddress
  billingAddress: PreparationStartedBillingAddress
  lines: Array<PreparationStartedLinesData>
  totals: PreparationStartedTotalData
}

export type EmailMessage = PreparationStartedMessage
