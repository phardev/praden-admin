import { InMemoryPromotionCodeGateway } from '@adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import { createPinia, setActivePinia } from 'pinia'
import {
  CreatePromotionCodeDTO,
  PromotionCode,
  PromotionScope
} from '@core/entities/promotionCode'
import { UUID } from '@core/types/types'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { ReductionType } from '@core/entities/promotion'
import { createPromotionCode } from './createPromotionCode'
import { tenEuroFixedPromotionCode } from '@utils/testData/promotionCodes'
import { PromotionCodeWithSameCodeAlreadyExistsError } from '@core/errors/PromotionCodeWithSameCodeAlreadyExistsError'

describe('Promotion code creation', () => {
  let promotionCodeStore: any
  let promotionCodeGateway: InMemoryPromotionCodeGateway
  let uuidGenerator: FakeUuidGenerator
  let dto: CreatePromotionCodeDTO
  let expectedPromotionCode: PromotionCode
  let uuid: UUID

  beforeEach(() => {
    setActivePinia(createPinia())
    uuidGenerator = new FakeUuidGenerator()
    promotionCodeGateway = new InMemoryPromotionCodeGateway(uuidGenerator)
    promotionCodeStore = usePromotionCodeStore()
  })

  describe('Create a simple promotion code', () => {
    beforeEach(async () => {
      givenNextUuidIs('new-code-uuid')
      dto = {
        amount: 10,
        code: 'NEW_CODE',
        conditions: {},
        reductionType: ReductionType.Percentage,
        scope: PromotionScope.Products
      }
      await whenCreatePromotionCode()
      expectedPromotionCode = {
        ...dto,
        uuid,
        currentUses: 0
      }
    })
    it('should save it in the gateway', async () => {
      expect(await promotionCodeGateway.list()).toStrictEqual([
        expectedPromotionCode
      ])
    })
    it('should save it in the store', () => {
      expect(promotionCodeStore.items).toStrictEqual([expectedPromotionCode])
    })
  })
  describe('Create a promotion code with conditions', () => {
    beforeEach(async () => {
      givenNextUuidIs('new-code-with-conditions-uuid')
      dto = {
        amount: 100,
        code: 'NEW_CODE_WITH_CONDITIONS',
        conditions: {
          minimumAmount: 80,
          maximumUsage: 100,
          deliveryMethodUuid: 'delivery-method-uuid'
        },
        reductionType: ReductionType.Fixed,
        scope: PromotionScope.Delivery
      }
      await whenCreatePromotionCode()
      expectedPromotionCode = {
        ...dto,
        uuid,
        currentUses: 0
      }
    })
    it('should save it in the gateway', async () => {
      expect(await promotionCodeGateway.list()).toStrictEqual([
        expectedPromotionCode
      ])
    })
    it('should save it in the store', () => {
      expect(promotionCodeStore.items).toStrictEqual([expectedPromotionCode])
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenNextUuidIs('new-uuid')
      dto = {
        amount: 5,
        code: 'LOADING',
        conditions: {},
        reductionType: ReductionType.Percentage,
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
      await whenCreatePromotionCode()
    })
    it('should be aware that loading is over', async () => {
      await whenCreatePromotionCode()
      expect(promotionCodeStore.isLoading).toBe(false)
    })
  })

  describe('Errors', () => {
    describe('A promotion code with same code already exists', () => {
      beforeEach(() => {
        givenExistingPromotionCodes(tenEuroFixedPromotionCode)
        dto = {
          amount: 5,
          code: tenEuroFixedPromotionCode.code,
          conditions: {},
          reductionType: ReductionType.Percentage,
          scope: PromotionScope.Products
        }
      })
      it('should throw an error', async () => {
        await expect(whenCreatePromotionCode()).rejects.toThrow(
          PromotionCodeWithSameCodeAlreadyExistsError
        )
      })
    })
  })

  const givenNextUuidIs = (givenUuid: UUID) => {
    uuid = givenUuid
    uuidGenerator.setNext(uuid)
  }

  const givenExistingPromotionCodes = (
    ...promotionCodes: Array<PromotionCode>
  ) => {
    promotionCodeGateway.feedWith(...promotionCodes)
  }

  const whenCreatePromotionCode = async () => {
    await createPromotionCode(dto, promotionCodeGateway)
  }
})
