import { PromotionStats } from '@core/entities/promotionStats'
import { anaca3Minceur, dolodent, ultraLevure } from './products'

export const dolodentPromotionStats: PromotionStats = {
  usageCount: 127,
  totalSales: 1587500,
  totalDiscountGiven: 158750,
  productUsages: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      usageCount: 127,
      totalAmountTaxIncluded: 1587500,
      totalReductionTaxIncluded: 158750
    }
  ]
}

export const multipleProductsPromotionStats: PromotionStats = {
  usageCount: 89,
  totalSales: 1142300,
  totalDiscountGiven: 8900,
  productUsages: [
    {
      productUuid: ultraLevure.uuid,
      name: ultraLevure.name,
      ean13: ultraLevure.ean13,
      usageCount: 53,
      totalAmountTaxIncluded: 676950,
      totalReductionTaxIncluded: 5300
    },
    {
      productUuid: anaca3Minceur.uuid,
      name: anaca3Minceur.name,
      ean13: anaca3Minceur.ean13,
      usageCount: 36,
      totalAmountTaxIncluded: 465350,
      totalReductionTaxIncluded: 3600
    }
  ]
}

export const noUsagePromotionStats: PromotionStats = {
  usageCount: 0,
  totalSales: 0,
  totalDiscountGiven: 0,
  productUsages: []
}
