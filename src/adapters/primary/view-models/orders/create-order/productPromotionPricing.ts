import type { Product } from '@core/entities/product'
import { ProductPromotion, ReductionType } from '@core/entities/promotion'
import type { Timestamp } from '@core/types/types'
import { addTaxToPrice } from '@utils/price'

export type ProductWithPromotions = Product & {
  promotions?: Array<ProductPromotion>
}

interface PricedProduct {
  priceWithoutTax: number
  percentTaxRate: number
}

const WIN_PROMOTION_NAME = 'WIN'

const isWinPromotion = (promotion: ProductPromotion): boolean => {
  return promotion.name === WIN_PROMOTION_NAME
}

const isPromotionActive = (
  promotion: ProductPromotion,
  now: Timestamp
): boolean => {
  return (
    (!promotion.startDate || promotion.startDate <= now) &&
    (!promotion.endDate || promotion.endDate >= now)
  )
}

const highestAmount = (
  promotions: Array<ProductPromotion>
): ProductPromotion => {
  return promotions.reduce((best, current) =>
    current.amount > best.amount ? current : best
  )
}

const mostRecent = (promotions: Array<ProductPromotion>): ProductPromotion => {
  return promotions.reduce((latest, current) =>
    (current.createdAt ?? 0) > (latest.createdAt ?? 0) ? current : latest
  )
}

const selectManualPromotion = (
  promotions: Array<ProductPromotion>
): ProductPromotion => {
  const percentagePromotions = promotions.filter(
    (promotion) => promotion.type === ReductionType.Percentage
  )
  if (percentagePromotions.length > 0) {
    return highestAmount(percentagePromotions)
  }
  return highestAmount(promotions)
}

export const selectApplicablePromotion = (
  promotions: Array<ProductPromotion> | undefined,
  now: Timestamp
): ProductPromotion | undefined => {
  const activePromotions = (promotions ?? []).filter((promotion) =>
    isPromotionActive(promotion, now)
  )
  const manualPromotions = activePromotions.filter(
    (promotion) => !isWinPromotion(promotion)
  )
  if (manualPromotions.length > 0) {
    return selectManualPromotion(manualPromotions)
  }
  const winPromotions = activePromotions.filter(isWinPromotion)
  if (winPromotions.length > 0) {
    return mostRecent(winPromotions)
  }
  return undefined
}

const discountedPriceWithoutTax = (
  product: PricedProduct,
  promotion: ProductPromotion
): number => {
  if (promotion.type === ReductionType.Percentage) {
    return product.priceWithoutTax * (1 - promotion.amount / 100)
  }
  return Math.max(
    0,
    product.priceWithoutTax -
      promotion.amount / (1 + product.percentTaxRate / 100)
  )
}

export const promotionalUnitPriceWithTax = (
  product: PricedProduct,
  promotion: ProductPromotion | undefined
): number => {
  const priceWithoutTax = promotion
    ? discountedPriceWithoutTax(product, promotion)
    : product.priceWithoutTax
  return Math.round(addTaxToPrice(priceWithoutTax, product.percentTaxRate))
}
