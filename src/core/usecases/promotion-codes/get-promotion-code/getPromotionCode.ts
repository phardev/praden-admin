import { PromotionCodeGateway } from '@core/gateways/promotionCodeGateway'
import { usePromotionCodeStore } from '@store/promotionCodeStore'

export const getPromotionCode = async (
  code: string,
  promotionCodeGateway: PromotionCodeGateway
) => {
  const promotionCodeStore = usePromotionCodeStore()
  promotionCodeStore.startLoading()
  const promotionCode = await promotionCodeGateway.getByCode(code)
  promotionCodeStore.setCurrent(promotionCode)
  promotionCodeStore.stopLoading()
}
