import { isPromotionInProgress } from '@core/entities/promotion'
import { DateProvider } from '@core/gateways/dateProvider'
import { ProductGateway } from '@core/gateways/productGateway'
import { PromotionGateway } from '@core/gateways/promotionGateway'
import { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'

export const getProduct = async (
  uuid: UUID,
  productGateway: ProductGateway,
  promotionGateway: PromotionGateway,
  dateProvider: DateProvider
): Promise<void> => {
  const productStore = useProductStore()
  try {
    productStore.startLoading()
    const product = await productGateway.getByUuid(uuid)
    const promotions = await promotionGateway.getPromotionsForProduct(uuid)
    const activePromotions = promotions.filter((p) =>
      isPromotionInProgress(p, dateProvider.now())
    )
    const promotion = activePromotions[0] || undefined
    productStore.setCurrent({ product, promotion })
  } finally {
    productStore.stopLoading()
  }
}
