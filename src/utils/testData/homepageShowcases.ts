import { ShowcaseProduct } from '@core/entities/homepageShowcase'
import { Product } from '@core/entities/product'
import { ProductPromotion, ReductionType } from '@core/entities/promotion'
import {
  anaca3Minceur,
  chamomilla,
  dolodent,
  ultraLevure
} from '@utils/testData/products'

export const toShowcaseProduct = (
  product: Product,
  promotions: Array<ProductPromotion> = []
): ShowcaseProduct => ({
  uuid: product.uuid,
  name: product.name,
  miniature: product.miniature,
  priceWithoutTax: product.priceWithoutTax,
  percentTaxRate: product.percentTaxRate,
  promotions
})

export const twentyPercentUntilEndOfNovember: ProductPromotion = {
  uuid: 'promotion-twenty-percent',
  type: ReductionType.Percentage,
  amount: 20,
  startDate: new Date('2026-11-01T00:00:00Z').getTime(),
  endDate: new Date('2026-11-30T12:00:00Z').getTime()
}

export const twoEurosFromBlackFriday: ProductPromotion = {
  uuid: 'promotion-two-euros',
  type: ReductionType.Fixed,
  amount: 200,
  startDate: new Date('2026-11-27T00:00:00Z').getTime(),
  endDate: new Date('2026-11-30T12:00:00Z').getTime()
}

export const showcase1: Array<ShowcaseProduct> = [
  toShowcaseProduct(dolodent),
  toShowcaseProduct(ultraLevure),
  toShowcaseProduct(anaca3Minceur),
  toShowcaseProduct(chamomilla)
]

export const showcase2: Array<ShowcaseProduct> = [
  toShowcaseProduct(chamomilla),
  toShowcaseProduct(dolodent)
]
