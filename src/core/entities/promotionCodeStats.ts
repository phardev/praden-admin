export interface PromotionCodeStatsEmailUsage {
  email: string
  usageCount: number
}

export interface PromotionCodeStats {
  usageCount: number
  totalSales: number
  totalDiscountGiven: number
  emailUsages: Array<PromotionCodeStatsEmailUsage>
}
