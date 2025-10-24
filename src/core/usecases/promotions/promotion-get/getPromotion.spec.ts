import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { PromotionDoesNotExistsError } from '@core/errors/PromotionDoesNotExistsError'
import { UUID } from '@core/types/types'
import { getPromotion } from '@core/usecases/promotions/promotion-get/getPromotion'
import { usePromotionStore } from '@store/promotionStore'
import { promotionFixedMultipleProducts } from '@utils/testData/promotions'
import { createPinia, setActivePinia } from 'pinia'

describe('Get promotion', () => {
  let promotionStore: any
  let promotionGateway: InMemoryPromotionGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
    promotionGateway = new InMemoryPromotionGateway(new FakeUuidGenerator())
  })
  describe('The promotion exists', () => {
    beforeEach(async () => {
      promotionGateway.feedWith(promotionFixedMultipleProducts)
      await whenGetPromotion(promotionFixedMultipleProducts.uuid)
    })
    it('should store it in promotion store', () => {
      expect(promotionStore.current).toStrictEqual(
        promotionFixedMultipleProducts
      )
    })
  })
  describe('The promotion does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetPromotion('NotExists')).rejects.toThrow(
        PromotionDoesNotExistsError
      )
    })
  })
  const whenGetPromotion = async (uuid: UUID) => {
    await getPromotion(uuid, promotionGateway)
  }
})
