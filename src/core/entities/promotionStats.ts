import { UUID } from '@core/types/types'

export interface PromotionProductUsage {
  productUuid: UUID
  name: string
  ean13: string
  usageCount: number
  totalAmountTaxIncluded: number
  totalReductionTaxIncluded: number
}

export interface PromotionStats {
  usageCount: number
  totalSales: number
  totalDiscountGiven: number
  productUsages: Array<PromotionProductUsage>
}
