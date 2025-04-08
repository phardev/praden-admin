import { InMemoryPromotionCodeGateway } from '@adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway'
import { createPinia, setActivePinia } from 'pinia'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import {
  PromotionCode,
  PromotionScope
} from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import {
  fifteenPercentPromotionCode,
  tenEuroFixedPromotionCode
} from '@utils/testData/promotionCodes'
import { editPromotionCode, EditPromotionCodeDTO } from './editPromotionCode'
import { PromotionCodeDoesNotExistsError } from '@core/errors/PromotionCodeDoesNotExistsError'
import { PromotionCodeWithSameCodeAlreadyExistsError } from '@core/errors/PromotionCodeWithSameCodeAlreadyExistsError'

describe('Promotion code edition', () => {
  let promotionCodeStore: any
  let promotionCodeGateway: InMemoryPromotionCodeGateway
  let dto: EditPromotionCodeDTO
  let expectedPromotionCode: PromotionCode

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeGateway = new InMemoryPromotionCodeGateway(
      new FakeUuidGenerator()
    )
    promotionCodeStore = usePromotionCodeStore()
  })

  describe('The promotion code exists', () => {
    beforeEach(async () => {
      givenExistingPromotionCodes(fifteenPercentPromotionCode)
      dto = {
        code: fifteenPercentPromotionCode.code,
        amount: 250,
        conditions: {
          minimumAmount: 6000
        }
      }
      await whenEditPromotionCode(fifteenPercentPromotionCode.code)
      expectedPromotionCode = {
        ...fifteenPercentPromotionCode,
        amount: 250,
        conditions: {
          ...fifteenPercentPromotionCode.conditions,
          minimumAmount: 6000
        }
      }
    })
    it('should save the edited promotion code', async () => {
      expect(await promotionCodeGateway.list()).toStrictEqual([
        expectedPromotionCode
      ])
    })
    it('should edit the promotion code store', () => {
      expect(promotionCodeStore.items).toStrictEqual([expectedPromotionCode])
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenExistingPromotionCodes(tenEuroFixedPromotionCode)
      dto = {
        amount: 5,
        scope: PromotionScope.Products
      }
    })
    it('should be aware during loading', async () => {
      const unsubscribe = promotionCodeStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenEditPromotionCode(tenEuroFixedPromotionCode.code)
    })
    it('should be aware that loading is over', async () => {
      await whenEditPromotionCode(tenEuroFixedPromotionCode.code)
      expect(promotionCodeStore.isLoading).toBe(false)
    })
  })

  describe('Errors', () => {
    describe('The promotion code does not exists', () => {
      it('should throw an error', async () => {
        await expect(whenEditPromotionCode('not-exists')).rejects.toThrow(
          PromotionCodeDoesNotExistsError
        )
      })
    })

    describe('A promotion code with same code already exists', () => {
      beforeEach(() => {
        givenExistingPromotionCodes(
          tenEuroFixedPromotionCode,
          fifteenPercentPromotionCode
        )
        dto = {
          code: fifteenPercentPromotionCode.code
        }
      })
      it('should throw an error', async () => {
        await expect(
          whenEditPromotionCode(tenEuroFixedPromotionCode.code)
        ).rejects.toThrow(PromotionCodeWithSameCodeAlreadyExistsError)
      })
    })
  })

  const givenExistingPromotionCodes = (
    ...promotionCodes: Array<PromotionCode>
  ) => {
    promotionCodeGateway.feedWith(...JSON.parse(JSON.stringify(promotionCodes)))
    promotionCodeStore.items = JSON.parse(JSON.stringify(promotionCodes))
  }

  const whenEditPromotionCode = async (code: string) => {
    await editPromotionCode(code, dto, promotionCodeGateway)
  }
})
