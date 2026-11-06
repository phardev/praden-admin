import { ProductPromotion } from '@core/entities/promotion'
import { UUID } from '@core/types/types'

export enum ShowcaseKind {
  PharmacistSelection = 'pharmacist-selection',
  HomepagePromotions = 'homepage-promotions'
}

export const HOMEPAGE_VISIBLE_PRODUCT_COUNT = 6

export interface ShowcaseProduct {
  uuid: UUID
  name: string
  miniature: string
  priceWithoutTax: number
  percentTaxRate: number
  promotions: Array<ProductPromotion>
}
