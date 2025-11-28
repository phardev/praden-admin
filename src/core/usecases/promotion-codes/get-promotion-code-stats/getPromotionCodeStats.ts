import { PromotionCodeGateway } from '@core/gateways/promotionCodeGateway'
import { usePromotionCodeStore } from '@store/promotionCodeStore'

export const getPromotionCodeStats = async (
  code: string,
  promotionCodeGateway: PromotionCodeGateway
): Promise<void> => {
  const promotionCodeStore = usePromotionCodeStore()
  promotionCodeStore.startLoading()
  const stats = await promotionCodeGateway.getStats(code)
  promotionCodeStore.setStats(stats)
  promotionCodeStore.stopLoading()
}
