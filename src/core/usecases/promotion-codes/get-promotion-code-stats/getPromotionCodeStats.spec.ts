import { InMemoryPromotionCodeGateway } from '@adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { PromotionCodeStats } from '@core/entities/promotionCodeStats'
import { getPromotionCodeStats } from '@core/usecases/promotion-codes/get-promotion-code-stats/getPromotionCodeStats'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import {
  newSitePromotionCodeStats,
  tenEuroFixedPromotionCodeStats
} from '@utils/testData/promotionCodeStats'
import { createPinia, setActivePinia } from 'pinia'

describe('Get promotion code stats', () => {
  let promotionCodeStore: ReturnType<typeof usePromotionCodeStore>
  let promotionCodeGateway: InMemoryPromotionCodeGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeStore = usePromotionCodeStore()
    promotionCodeGateway = new InMemoryPromotionCodeGateway(
      new FakeUuidGenerator()
    )
  })

  describe('Load stats for a promotion code', () => {
    it('should save stats in store', async () => {
      givenPromotionCodeStatsExist('FIXED', tenEuroFixedPromotionCodeStats)
      await whenGetPromotionCodeStats('FIXED')
      expectStatsInStoreToBe(tenEuroFixedPromotionCodeStats)
    })

    it('should save different stats in store', async () => {
      givenPromotionCodeStatsExist('NEW SITE', newSitePromotionCodeStats)
      await whenGetPromotionCodeStats('NEW SITE')
      expectStatsInStoreToBe(newSitePromotionCodeStats)
    })
  })

  describe('Loading states', () => {
    beforeEach(() => {
      givenPromotionCodeStatsExist('FIXED', tenEuroFixedPromotionCodeStats)
    })

    it('should start loading', async () => {
      const unsubscribe = promotionCodeStore.$subscribe((_mutation, state) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })
      await whenGetPromotionCodeStats('FIXED')
    })

    it('should stop loading', async () => {
      await whenGetPromotionCodeStats('FIXED')
      expect(promotionCodeStore.isLoading).toBe(false)
    })
  })

  describe('Promotion code with no usage', () => {
    it('should return zero stats', async () => {
      givenPromotionCodeStatsExist('UNUSED', newSitePromotionCodeStats)
      await whenGetPromotionCodeStats('UNUSED')
      expectStatsInStoreToBe(newSitePromotionCodeStats)
    })
  })

  const givenPromotionCodeStatsExist = (
    code: string,
    stats: PromotionCodeStats
  ) => {
    promotionCodeGateway.feedStatsFor(code, stats)
  }

  const whenGetPromotionCodeStats = async (code: string) => {
    await getPromotionCodeStats(code, promotionCodeGateway)
  }

  const expectStatsInStoreToBe = (stats: PromotionCodeStats) => {
    expect(promotionCodeStore.stats).toStrictEqual(stats)
  }
})
