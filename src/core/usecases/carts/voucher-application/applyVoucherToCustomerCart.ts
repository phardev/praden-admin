import { CartAction } from '@core/entities/cart'
import type { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'
import { useCartDetailStore } from '@store/cartDetailStore'

export const applyVoucherToCustomerCart = async (
  customerUuid: UUID,
  code: string,
  cartGateway: CartGateway
): Promise<void> => {
  const cartDetailStore = useCartDetailStore()
  cartDetailStore.startAction(CartAction.ApplyVoucher)
  try {
    cartDetailStore.replace(await cartGateway.applyVoucher(customerUuid, code))
  } finally {
    cartDetailStore.stopAction()
  }
}
