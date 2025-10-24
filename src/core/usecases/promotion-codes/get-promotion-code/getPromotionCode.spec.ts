import { InMemoryPromotionCodeGateway } from '@adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { PromotionCode } from '@core/entities/promotionCode'
import { PromotionCodeDoesNotExistsError } from '@core/errors/PromotionCodeDoesNotExistsError'
import { getPromotionCode } from '@core/usecases/promotion-codes/get-promotion-code/getPromotionCode'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import {
  limitedInTimePromotionCode,
  newSitePromotionCode,
  tenEuroFixedPromotionCode
} from '@utils/testData/promotionCodes'
import { createPinia, setActivePinia } from 'pinia'

describe('Get promotion code', () => {
  let promotionCodeStore: any
  let promotionCodeGateway: InMemoryPromotionCodeGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeStore = usePromotionCodeStore()
    promotionCodeGateway = new InMemoryPromotionCodeGateway(
      new FakeUuidGenerator()
    )
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
