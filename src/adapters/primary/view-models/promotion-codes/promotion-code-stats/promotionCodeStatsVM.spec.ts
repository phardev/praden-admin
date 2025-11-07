import {
  PromotionCodeStatsVM,
  promotionCodeStatsVM
} from '@adapters/primary/view-models/promotion-codes/promotion-code-stats/promotionCodeStatsVM'
import { PromotionCodeStats } from '@core/entities/promotionCodeStats'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import {
  newSitePromotionCodeStats,
  tenEuroFixedPromotionCodeStats
} from '@utils/testData/promotionCodeStats'
import { createPinia, setActivePinia } from 'pinia'

describe('Promotion code stats VM', () => {
  let promotionCodeStore: ReturnType<typeof usePromotionCodeStore>
  let vm: PromotionCodeStatsVM | null

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeStore = usePromotionCodeStore()
  })

  describe('Display usage count', () => {
    it('should return usage count', () => {
      givenStatsInStore(tenEuroFixedPromotionCodeStats)
      whenGetVM()
      expectVMToBe({
        usageCount: 25,
        totalSales: '1250.00 €',
        totalSalesRaw: 1250,
        totalDiscountGiven: '125.00 €',
        totalDiscountGivenRaw: 125,
        emailUsages: [
          { email: 'test@test.com', usageCount: 10 },
          { email: 'another@email.com', usageCount: 15 }
        ]
      })
    })

    it('should return different usage count', () => {
      givenStatsInStore(newSitePromotionCodeStats)
      whenGetVM()
      expectVMToBe({
        usageCount: 0,
        totalSales: '0.00 €',
        totalSalesRaw: 0,
        totalDiscountGiven: '0.00 €',
        totalDiscountGivenRaw: 0,
        emailUsages: []
      })
    })
  })

  describe('Format total sales', () => {
    it('should convert cents to euros with 2 decimals', () => {
      givenStatsInStore(tenEuroFixedPromotionCodeStats)
      whenGetVM()
      expectTotalSalesToBe('1250.00 €')
    })

    it('should handle zero sales', () => {
      givenStatsInStore(newSitePromotionCodeStats)
      whenGetVM()
      expectTotalSalesToBe('0.00 €')
    })
  })

  describe('Format discount given', () => {
    it('should convert cents to euros with 2 decimals', () => {
      givenStatsInStore(tenEuroFixedPromotionCodeStats)
      whenGetVM()
      expectTotalDiscountGivenToBe('125.00 €')
    })

    it('should handle zero discount', () => {
      givenStatsInStore(newSitePromotionCodeStats)
      whenGetVM()
      expectTotalDiscountGivenToBe('0.00 €')
    })
  })

  describe('Display email usages', () => {
    it('should return email usages list', () => {
      givenStatsInStore(tenEuroFixedPromotionCodeStats)
      whenGetVM()
      expectEmailUsagesToBe([
        { email: 'test@test.com', usageCount: 10 },
        { email: 'another@email.com', usageCount: 15 }
      ])
    })

    it('should return empty list when no usages', () => {
      givenStatsInStore(newSitePromotionCodeStats)
      whenGetVM()
      expectEmailUsagesToBe([])
    })
  })

  describe('Handle missing stats', () => {
    it('should return null when stats undefined', () => {
      whenGetVM()
      expectVMToBeNull()
    })
  })

  const givenStatsInStore = (stats: PromotionCodeStats) => {
    promotionCodeStore.stats = stats
  }

  const whenGetVM = () => {
    vm = promotionCodeStatsVM()
  }

  const expectVMToBe = (expected: PromotionCodeStatsVM) => {
    expect(vm).toStrictEqual(expected)
  }

  const expectVMToBeNull = () => {
    expect(vm).toBeNull()
  }

  const expectTotalSalesToBe = (expected: string) => {
    expect(vm?.totalSales).toStrictEqual(expected)
  }

  const expectTotalDiscountGivenToBe = (expected: string) => {
    expect(vm?.totalDiscountGiven).toStrictEqual(expected)
  }

  const expectEmailUsagesToBe = (
    expected: Array<{ email: string; usageCount: number }>
  ) => {
    expect(vm?.emailUsages).toStrictEqual(expected)
  }
})
