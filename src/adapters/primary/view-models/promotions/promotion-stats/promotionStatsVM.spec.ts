import { promotionStatsVM } from '@adapters/primary/view-models/promotions/promotion-stats/promotionStatsVM'
import { usePromotionStore } from '@store/promotionStore'
import {
  dolodentPromotionStats,
  noUsagePromotionStats
} from '@utils/testData/promotionStats'
import { createPinia, setActivePinia } from 'pinia'

describe('Promotion stats VM', () => {
  let promotionStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
  })

  describe('Stats are available', () => {
    beforeEach(() => {
      promotionStore.setStats(dolodentPromotionStats)
    })

    it('should format currency amounts correctly', () => {
      const vm = promotionStatsVM()
      expect(vm).toStrictEqual({
        usageCount: 127,
        totalSales: '15\u202F875,00\u00A0€',
        totalSalesRaw: 1587500,
        totalDiscountGiven: '1\u202F587,50\u00A0€',
        totalDiscountGivenRaw: 158750,
        productUsages: [
          {
            productUuid: 'product-dolodent',
            name: 'Dolodent solution 27g',
            ean13: '3400921929201',
            usageCount: 127,
            totalAmountTaxIncluded: '15\u202F875,00\u00A0€',
            totalReductionTaxIncluded: '1\u202F587,50\u00A0€'
          }
        ]
      })
    })
  })

  describe('Stats have no usage', () => {
    beforeEach(() => {
      promotionStore.setStats(noUsagePromotionStats)
    })

    it('should handle zero stats', () => {
      const vm = promotionStatsVM()
      expect(vm).toStrictEqual({
        usageCount: 0,
        totalSales: '0,00\u00A0€',
        totalSalesRaw: 0,
        totalDiscountGiven: '0,00\u00A0€',
        totalDiscountGivenRaw: 0,
        productUsages: []
      })
    })
  })

  describe('Stats are not loaded', () => {
    it('should return null when stats are undefined', () => {
      const vm = promotionStatsVM()
      expect(vm).toStrictEqual(null)
    })
  })
})
