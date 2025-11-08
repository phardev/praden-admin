import { PromotionCodeStatsEmailUsage } from '@core/entities/promotionCodeStats'
import { usePromotionCodeStore } from '@store/promotionCodeStore'

export interface PromotionCodeStatsVM {
  usageCount: number
  totalSales: string
  totalSalesRaw: number
  totalDiscountGiven: string
  totalDiscountGivenRaw: number
  emailUsages: Array<PromotionCodeStatsEmailUsage>
}

export const promotionCodeStatsVM = (): PromotionCodeStatsVM | null => {
  const promotionCodeStore = usePromotionCodeStore()
  const stats = promotionCodeStore.stats

  if (!stats) {
    return null
  }

  return {
    usageCount: stats.usageCount,
    totalSales: (stats.totalSales / 100).toFixed(2) + ' €',
    totalSalesRaw: stats.totalSales / 100,
    totalDiscountGiven: (stats.totalDiscountGiven / 100).toFixed(2) + ' €',
    totalDiscountGivenRaw: stats.totalDiscountGiven / 100,
    emailUsages: stats.emailUsages
  }
}
