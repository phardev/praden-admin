import { PromotionGateway } from '@core/usecases/promotions/promotions-listing/promotionGateway'
import { usePromotionStore } from '@store/promotionStore'

export const listPromotions = async (
  promotionGateway: PromotionGateway
): Promise<void> => {
  const promotions = await promotionGateway.list()
  const promotionStore = usePromotionStore()
  promotionStore.list(promotions)
  return Promise.resolve()
}
