import { CustomerCartAction } from '@core/entities/cart'
import type { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'
import { useCustomerStore } from '@store/customerStore'

export const applyVoucherToCustomerCart = async (
  customerUuid: UUID,
  code: string,
  cartGateway: CartGateway
): Promise<void> => {
  const customerStore = useCustomerStore()
  customerStore.startCartAction(CustomerCartAction.ApplyVoucher)
  try {
    const cart = await cartGateway.applyVoucher(customerUuid, code)
    customerStore.setCurrentCart(cart)
  } finally {
    customerStore.stopCartAction()
  }
}
