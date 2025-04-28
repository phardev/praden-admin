import { CreatePromotionCodeDTO } from '@core/entities/promotionCode'
import { PromotionCodeGateway } from '@core/gateways/promotionCodeGateway'
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
