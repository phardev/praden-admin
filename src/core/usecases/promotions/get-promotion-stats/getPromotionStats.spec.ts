import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UUID } from '@core/types/types'
import { getPromotionStats } from '@core/usecases/promotions/get-promotion-stats/getPromotionStats'
import { usePromotionStore } from '@store/promotionStore'
import {
  dolodentPromotionStats,
  noUsagePromotionStats
} from '@utils/testData/promotionStats'
import { createPinia, setActivePinia } from 'pinia'

describe('Get promotion stats', () => {
  let promotionStore: any
  let promotionGateway: InMemoryPromotionGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
    promotionGateway = new InMemoryPromotionGateway(new FakeUuidGenerator())
  })

  describe('The promotion has stats', () => {
    beforeEach(async () => {
      promotionGateway.feedStatsFor(
        'promotion-dolodent',
        dolodentPromotionStats
      )
      await whenGetPromotionStats('promotion-dolodent')
    })

    it('should store stats in promotion store', () => {
      expect(promotionStore.stats).toStrictEqual(dolodentPromotionStats)
    })
  })

  describe('Loading states', () => {
    beforeEach(() => {
      promotionGateway.feedStatsFor(
        'promotion-dolodent',
        dolodentPromotionStats
      )
    })

    it('should set loading to true before fetching', async () => {
      const getStatsPromise = whenGetPromotionStats('promotion-dolodent')
      expect(promotionStore.isLoading).toStrictEqual(true)
      await getStatsPromise
    })

    it('should set loading to false after fetching', async () => {
      await whenGetPromotionStats('promotion-dolodent')
      expect(promotionStore.isLoading).toStrictEqual(false)
    })
  })

  describe('The promotion has no usage', () => {
    beforeEach(async () => {
      promotionGateway.feedStatsFor('promotion-no-usage', noUsagePromotionStats)
      await whenGetPromotionStats('promotion-no-usage')
    })

    it('should store zero stats in promotion store', () => {
      expect(promotionStore.stats).toStrictEqual(noUsagePromotionStats)
    })
  })

  const whenGetPromotionStats = async (uuid: UUID) => {
    await getPromotionStats(uuid, promotionGateway)
  }
})
