import { createPinia, setActivePinia } from 'pinia'
import { usePromotionStore } from '@store/promotionStore'
import { listPromotions } from '@core/usecases/promotions/promotions-listing/listPromotions'
import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { promotionPercentageDolodentListItem } from '@utils/testData/fixtures/promotions/promotionListItems'
import { PromotionListItem } from './promotionListItem'

describe('List promotions', () => {
  let promotionStore: any
  let promotionGateway: InMemoryPromotionGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
    promotionGateway = new InMemoryPromotionGateway(new FakeUuidGenerator())
  })

  describe('There is no promotion', () => {
    it('should list nothing', async () => {
      await whenListPromotions()
      expectPromotionStoreToContains()
    })
  })

  describe('There is some promotions', () => {
    it('should list all of them', async () => {
      givenThereIsExistingPromotions(promotionPercentageDolodentListItem)
      await whenListPromotions()
      expectPromotionStoreToContains(promotionPercentageDolodentListItem)
    })
  })

  const givenThereIsExistingPromotions = (
    ...promotions: Array<PromotionListItem>
  ) => {
    promotionGateway.feedListItemWith(...promotions)
  }

  const whenListPromotions = async () => {
    await listPromotions(promotionGateway)
  }

  const expectPromotionStoreToContains = (
    ...promotions: Array<PromotionListItem>
  ) => {
    expect(promotionStore.items).toStrictEqual(promotions)
  }
})
