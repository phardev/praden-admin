import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import {
  PromotionNeedsProductError,
  PromotionReductionCannotExceed100Error
} from '@core/errors/PromotionNeedProductError'
import { PromotionGateway } from '@core/gateways/promotionGateway'
import { usePromotionStore } from '@store/promotionStore'

export const createPromotion = async (
  promotion: CreatePromotionDTO,
  promotionGateway: PromotionGateway
): Promise<void> => {
  if (promotion.products.length === 0) {
    throw new PromotionNeedsProductError()
  }
  if (promotion.type === ReductionType.Percentage && promotion.amount > 100) {
    throw new PromotionReductionCannotExceed100Error(promotion.amount)
  }
  const createdPromotion = await promotionGateway.create(promotion)
  const promotionStore = usePromotionStore()
  promotionStore.add(createdPromotion)
}
