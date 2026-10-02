import type { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'
import { useCartDetailStore } from '@store/cartDetailStore'

export const getCartDetail = async (
  uuid: UUID,
  cartGateway: CartGateway
): Promise<void> => {
  const cartDetailStore = useCartDetailStore()
  cartDetailStore.startLoading()
  try {
    cartDetailStore.setCurrent(await cartGateway.getByUuid(uuid))
  } finally {
    cartDetailStore.stopLoading()
  }
}
