import type { Timestamp } from '@core/types/types'
import { useSearchStore } from '@store/searchStore'
import { priceFormatter } from '@utils/formatters'
import type { ProductWithPromotions } from './productPromotionPricing'
import {
  promotionalUnitPriceWithTax,
  selectApplicablePromotion
} from './productPromotionPricing'

export interface OrderCreateProductSearchItemVM {
  uuid: string
  name: string
  ean13: string
  miniature: string
  formattedPriceWithTax: string
  hasPromotion: boolean
  availableStock: number
  isAdded: boolean
}

export interface OrderCreateProductSearchVM {
  results: Array<OrderCreateProductSearchItemVM>
  isLoading: boolean
  hasError: boolean
}

export const orderCreateProductSearchVM = (
  namespace: string,
  addedProductUuids: Array<string>,
  now: Timestamp
): OrderCreateProductSearchVM => {
  const searchStore = useSearchStore()
  const results = searchStore.get(namespace) || []
  const formatter = priceFormatter('fr-FR', 'EUR')
  return {
    results: results.map((product: ProductWithPromotions) => {
      const promotion = selectApplicablePromotion(product.promotions, now)
      return {
        uuid: product.uuid,
        name: product.name,
        ean13: product.ean13,
        miniature: product.miniature,
        formattedPriceWithTax: formatter.format(
          promotionalUnitPriceWithTax(product, promotion) / 100
        ),
        hasPromotion: promotion !== undefined,
        availableStock: product.availableStock,
        isAdded: addedProductUuids.includes(product.uuid)
      }
    }),
    isLoading: searchStore.isLoading(namespace),
    hasError: !!searchStore.getError(namespace)
  }
}
