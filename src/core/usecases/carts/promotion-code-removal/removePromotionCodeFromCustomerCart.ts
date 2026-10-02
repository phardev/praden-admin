import { CartAction } from '@core/entities/cart'
import type { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'
import { useCartDetailStore } from '@store/cartDetailStore'

export const removePromotionCodeFromCustomerCart = async (
  customerUuid: UUID,
  cartGateway: CartGateway
): Promise<void> => {
  const cartDetailStore = useCartDetailStore()
  cartDetailStore.startAction(CartAction.RemovePromotionCode)
  try {
    cartDetailStore.replace(await cartGateway.removePromotionCode(customerUuid))
  } finally {
    cartDetailStore.stopAction()
  }
}
