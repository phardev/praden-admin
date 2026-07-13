import { Address, Contact } from '@core/entities/order'
import { OrderGateway } from '@core/gateways/orderGateway'
import { Timestamp, UUID } from '@core/types/types'
import { useOrderStore } from '@store/orderStore'

export interface CreateManualOrderLineDTO {
  productUuid: UUID
  quantity: number
}

export enum ManualOrderPaymentMode {
  AlreadyPaid = 'ALREADY_PAID',
  PaymentPage = 'PAYMENT_PAGE',
  PaymentLink = 'PAYMENT_LINK'
}

export interface CreateManualOrderDTO {
  customerUuid: UUID
  lines: Array<CreateManualOrderLineDTO>
  deliveryMethodUuid: UUID
  deliveryAddress: Address
  billingAddress: Address
  contact: Contact
  pickupId?: string
  pickingDate?: Timestamp
  sendConfirmationEmail?: boolean
  paymentMode?: ManualOrderPaymentMode
}

export const createManualOrder = async (
  dto: CreateManualOrderDTO,
  orderGateway: OrderGateway
): Promise<void> => {
  const created = await orderGateway.create(dto)
  const orderStore = useOrderStore()
  orderStore.setCurrent(created)
}
