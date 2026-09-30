import { CustomerCartAction } from '@core/entities/cart'
import type { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'
import { useCustomerStore } from '@store/customerStore'

export const removeVoucherFromCustomerCart = async (
  customerUuid: UUID,
  cartGateway: CartGateway
): Promise<void> => {
  const customerStore = useCustomerStore()
  customerStore.startCartAction(CustomerCartAction.RemoveVoucher)
  try {
    const cart = await cartGateway.removeVoucher(customerUuid)
    customerStore.setCurrentCart(cart)
  } finally {
    customerStore.stopCartAction()
  }
}
