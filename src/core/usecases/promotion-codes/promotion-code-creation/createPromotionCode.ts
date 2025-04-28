import { CreatePromotionCodeDTO } from '@core/entities/promotionCode'
import { PromotionCodeGateway } from '@core/gateways/promotionCodeGateway'
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
