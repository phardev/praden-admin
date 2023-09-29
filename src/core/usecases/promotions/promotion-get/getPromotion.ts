import { UUID } from '@core/types/types'
import { PromotionGateway } from '@core/gateways/promotionGateway'
import { usePromotionStore } from '@store/promotionStore'

export const getPromotion = async (
  uuid: UUID,
  promotionGateway: PromotionGateway
) => {
  const promotion = await promotionGateway.getByUuid(uuid)
  const promotionStore = usePromotionStore()
  promotionStore.setCurrent(promotion)
}
