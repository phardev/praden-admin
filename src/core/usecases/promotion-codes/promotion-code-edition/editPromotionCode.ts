import { CreatePromotionCodeDTO } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import { PromotionCodeGateway } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCodeGateway'
import { usePromotionCodeStore } from '@store/promotionCodeStore'

export type EditPromotionCodeDTO = Partial<CreatePromotionCodeDTO>

export const editPromotionCode = async (
  code: string,
  dto: EditPromotionCodeDTO,
  promotionCodeGateway: PromotionCodeGateway
) => {
  const promotionCodeStore = usePromotionCodeStore()
  promotionCodeStore.startLoading()
  const edited = await promotionCodeGateway.edit(code, dto)
  promotionCodeStore.edit(edited)
  promotionCodeStore.stopLoading()
}
