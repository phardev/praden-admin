import { CustomerCartAction } from '@core/entities/cart'
import type { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'
import { useCustomerStore } from '@store/customerStore'

export const removePromotionCodeFromCustomerCart = async (
  customerUuid: UUID,
  cartGateway: CartGateway
): Promise<void> => {
  const customerStore = useCustomerStore()
  customerStore.startCartAction(CustomerCartAction.RemovePromotionCode)
  try {
    const cart = await cartGateway.removePromotionCode(customerUuid)
    customerStore.setCurrentCart(cart)
  } finally {
    customerStore.stopCartAction()
  }
}
