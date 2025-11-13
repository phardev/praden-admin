import { UUID } from '@core/types/types'
import { usePromotionStore } from '@store/promotionStore'
import { formatCurrency } from '@utils/formatters'

export interface PromotionStatsVM {
  usageCount: number
  totalSales: string
  totalSalesRaw: number
  totalDiscountGiven: string
  totalDiscountGivenRaw: number
  productUsages: Array<{
    productUuid: UUID
    name: string
    ean13: string
    usageCount: number
    totalAmountTaxIncluded: string
    totalReductionTaxIncluded: string
  }>
}

export const promotionStatsVM = (): PromotionStatsVM | null => {
  const promotionStore = usePromotionStore()
  if (!promotionStore.stats) return null

  return {
    usageCount: promotionStore.stats.usageCount,
    totalSales: formatCurrency(promotionStore.stats.totalSales / 100),
    totalSalesRaw: promotionStore.stats.totalSales,
    totalDiscountGiven: formatCurrency(
      promotionStore.stats.totalDiscountGiven / 100
    ),
    totalDiscountGivenRaw: promotionStore.stats.totalDiscountGiven,
    productUsages: promotionStore.stats.productUsages.map((usage) => ({
      productUuid: usage.productUuid,
      name: usage.name,
      ean13: usage.ean13,
      usageCount: usage.usageCount,
      totalAmountTaxIncluded: formatCurrency(
        usage.totalAmountTaxIncluded / 100
      ),
      totalReductionTaxIncluded: formatCurrency(
        usage.totalReductionTaxIncluded / 100
      )
    }))
  }
}
