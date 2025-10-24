import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { PromotionCode } from '@core/entities/promotionCode'
import { listPromotionCodes } from '@core/usecases/promotion-codes/promotion-code-listing/listPromotionCodes'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import {
  deliveryPromotionCode,
  fifteenPercentPromotionCode,
  newSitePromotionCode
} from '@utils/testData/promotionCodes'
import { createPinia, setActivePinia } from 'pinia'
import { InMemoryPromotionCodeGateway } from '../../../../adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway'

describe('Promotion code listing', () => {
  let promotionCodeStore: any
  let promotionCodeGateway: InMemoryPromotionCodeGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeGateway = new InMemoryPromotionCodeGateway(
      new FakeUuidGenerator()
    )
    promotionCodeStore = usePromotionCodeStore()
  })

  describe('There is some promotion codes', () => {
    it('should list all of them', async () => {
      givenExistingPromotionCodes(
        fifteenPercentPromotionCode,
        newSitePromotionCode,
        deliveryPromotionCode
      )
      await whenListPromotionCodes()
      expect(promotionCodeStore.items).toStrictEqual([
        fifteenPercentPromotionCode,
        newSitePromotionCode,
        deliveryPromotionCode
      ])
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = promotionCodeStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListPromotionCodes()
    })
    it('should be aware that loading is over', async () => {
      await whenListPromotionCodes()
      expect(promotionCodeStore.isLoading).toBe(false)
    })
  })
  const givenExistingPromotionCodes = (
    ...promotionCodes: Array<PromotionCode>
  ) => {
    promotionCodeGateway.feedWith(...promotionCodes)
  }

  const whenListPromotionCodes = async () => {
    await listPromotionCodes(promotionCodeGateway)
  }
})
