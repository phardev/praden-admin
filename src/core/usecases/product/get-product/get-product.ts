import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { PromotionGateway } from '@core/gateways/promotionGateway'
import { DateProvider } from '@core/gateways/dateProvider'
import { isPromotionInProgress } from '@core/entities/promotion'

export const getProduct = async (
  uuid: UUID,
  productGateway: ProductGateway,
  promotionGateway: PromotionGateway,
  dateProvider: DateProvider
): Promise<void> => {
  const product = await productGateway.getByUuid(uuid)
  const productStore = useProductStore()
  const promotions = await promotionGateway.getPromotionsForProduct(uuid)
  const activePromotions = promotions.filter((p) =>
    isPromotionInProgress(p, dateProvider.now())
  )
  const promotion = activePromotions[0] || undefined
  productStore.setCurrent({ product, promotion })
}
