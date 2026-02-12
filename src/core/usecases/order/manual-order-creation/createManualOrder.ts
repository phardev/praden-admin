import type { OrderGateway } from '@core/gateways/orderGateway'
import { useOrderStore } from '@store/orderStore'

export interface CreateManualOrderDTO {
  customer: {
    uuid?: string
    firstname: string
    lastname: string
    email: string
    phone: string
  }
  deliveryAddress: {
    name: string
    address: string
    zip: string
    city: string
    country: string
    phone: string
  }
  billingAddress: {
    name: string
    address: string
    zip: string
    city: string
    country: string
    phone: string
  }
  lines: Array<{
    productUuid: string
    priceWithoutTax: number
    percentTaxRate: number
    quantity: number
    weight: number
  }>
  deliveryMethodUuid: string
  promotionCode?: string
  customerMessage?: string
}

export const createManualOrder = async (
  dto: CreateManualOrderDTO,
  orderGateway: OrderGateway
): Promise<void> => {
  const orderStore = useOrderStore()
  try {
    orderStore.startLoading()
    const order = await orderGateway.create(dto)
    orderStore.setCurrent(order)
  } finally {
    orderStore.stopLoading()
  }
}
