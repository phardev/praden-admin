import { PromotionGateway } from '@core/gateways/promotionGateway'
import { usePromotionStore } from '@store/promotionStore'

export const listPromotions = async (
  promotionGateway: PromotionGateway
): Promise<void> => {
  const promotionStore = usePromotionStore()

  if (promotionStore.isLoading) {
    return
  }

  try {
    promotionStore.startLoading()
    const promotions = await promotionGateway.list()
    promotionStore.list(promotions)
  } finally {
    promotionStore.stopLoading()
  }
}
