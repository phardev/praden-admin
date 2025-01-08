import { PromotionCodeGateway } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCodeGateway'
import { usePromotionCodeStore } from '@store/promotionCodeStore'

export const listPromotionCodes = async (
  promotionCodeGateway: PromotionCodeGateway
): Promise<void> => {
  const promotionCodeStore = usePromotionCodeStore()
  promotionCodeStore.startLoading()
  const promotionCodes = await promotionCodeGateway.list()
  promotionCodeStore.list(promotionCodes)
  promotionCodeStore.stopLoading()
}
