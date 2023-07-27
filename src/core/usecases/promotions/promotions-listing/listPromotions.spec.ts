import { createPinia, setActivePinia } from 'pinia'
import { usePromotionStore } from '@store/promotionStore'
import { listPromotions } from '@core/usecases/promotions/promotions-listing/listPromotions'
import { Promotion } from '@core/usecases/promotions/promotions-listing/promotion'
import { InMemoryPromotionGateway } from '@core/usecases/promotions/promotions-listing/inMemoryPromotionGateway'
import { promotionPercentageDolodent } from '@utils/testData/promotions'

describe('List promotions', () => {
  let promotionStore: any
  let promotionGateway: InMemoryPromotionGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
    promotionGateway = new InMemoryPromotionGateway()
  })

  describe('There is no promotion', () => {
    it('should list nothing', async () => {
      await whenListPromotions()
      expectPromotionStoreToContains()
    })
  })

  describe('There is some promotions', () => {
    it('should list all of them', async () => {
      givenThereIsExistingPromotions(promotionPercentageDolodent)
      await whenListPromotions()
      expectPromotionStoreToContains(promotionPercentageDolodent)
    })
  })

  const givenThereIsExistingPromotions = (...promotions: Array<Promotion>) => {
    promotionGateway.feedWith(...promotions)
  }

  const whenListPromotions = async () => {
    await listPromotions(promotionGateway)
  }

  const expectPromotionStoreToContains = (...promotions: Array<Promotion>) => {
    expect(promotionStore.items).toStrictEqual(promotions)
  }
})
