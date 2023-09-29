import { PromotionGateway } from '@core/gateways/promotionGateway'
import { usePromotionStore } from '@store/promotionStore'

export const listPromotions = async (
  promotionGateway: PromotionGateway
): Promise<void> => {
  const promotions = await promotionGateway.list()
  const promotionStore = usePromotionStore()
  promotionStore.list(promotions)
  return Promise.resolve()
}
