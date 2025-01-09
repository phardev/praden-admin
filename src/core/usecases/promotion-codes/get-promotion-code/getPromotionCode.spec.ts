import { createPinia, setActivePinia } from 'pinia'
import { InMemoryPromotionCodeGateway } from '@core/usecases/promotion-codes/promotion-code-listing/InMemoryPromotionCodeGateway'
import { PromotionCode } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import {
  limitedInTimePromotionCode,
  newSitePromotionCode,
  tenEuroFixedPromotionCode
} from '@utils/testData/promotionCodes'
import { getPromotionCode } from '@core/usecases/promotion-codes/get-promotion-code/getPromotionCode'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import { PromotionCodeDoesNotExistsError } from '@core/errors/PromotionCodeDoesNotExistsError'

describe('Get promotion code', () => {
  let promotionCodeStore: any
  let promotionCodeGateway: InMemoryPromotionCodeGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeStore = usePromotionCodeStore()
    promotionCodeGateway = new InMemoryPromotionCodeGateway()
  })

  describe('The promotion code exists', () => {
    it('should save it in the store', async () => {
      givenExistingPromotionCodes(tenEuroFixedPromotionCode)
      await whenGetPromotionCode(tenEuroFixedPromotionCode.code)
      expectCurrentPromotionCodeToBe(tenEuroFixedPromotionCode)
    })
    it('should save another one in the store', async () => {
      givenExistingPromotionCodes(limitedInTimePromotionCode)
      await whenGetPromotionCode(limitedInTimePromotionCode.code)
      expectCurrentPromotionCodeToBe(limitedInTimePromotionCode)
    })
  })

  describe('The promotion code exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetPromotionCode('not-exists')).rejects.toThrow(
        PromotionCodeDoesNotExistsError
      )
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenExistingPromotionCodes(newSitePromotionCode)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = promotionCodeStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenGetPromotionCode(newSitePromotionCode.code)
    })
    it('should be aware that loading is over', async () => {
      await whenGetPromotionCode(newSitePromotionCode.code)
      expect(promotionCodeStore.isLoading).toBe(false)
    })
  })

  const givenExistingPromotionCodes = (
    ...promotionCodes: Array<PromotionCode>
  ) => {
    promotionCodeGateway.feedWith(...promotionCodes)
  }

  const whenGetPromotionCode = async (code: string) => {
    await getPromotionCode(code, promotionCodeGateway)
  }

  const expectCurrentPromotionCodeToBe = (promotionCode: PromotionCode) => {
    expect(promotionCodeStore.current).toStrictEqual(promotionCode)
  }
})
