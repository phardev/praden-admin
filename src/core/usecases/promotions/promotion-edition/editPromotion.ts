import { EditPromotionDTO } from '@core/entities/promotion'
import { UUID } from '@core/types/types'
import { PromotionGateway } from '@core/gateways/promotionGateway'
import { usePromotionStore } from '@store/promotionStore'

export const editPromotion = async (
  uuid: UUID,
  dto: EditPromotionDTO,
  promotionGateway: PromotionGateway
) => {
  const editedPromotion = await promotionGateway.edit(uuid, dto)
  const promotionStore = usePromotionStore()
  promotionStore.edit(editedPromotion)
}
