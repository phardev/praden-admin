import { CreatePromotionCodeDTO } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import { PromotionCodeGateway } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCodeGateway'
import { usePromotionCodeStore } from '@store/promotionCodeStore'

export const createPromotionCode = async (
  dto: CreatePromotionCodeDTO,
  promotionCodeGateway: PromotionCodeGateway
) => {
  const promotionCodeStore = usePromotionCodeStore()
  promotionCodeStore.startLoading()
  const created = await promotionCodeGateway.create(dto)
  promotionCodeStore.create(created)
  promotionCodeStore.stopLoading()
}
