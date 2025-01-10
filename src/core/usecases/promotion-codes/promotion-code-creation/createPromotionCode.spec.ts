import { InMemoryPromotionCodeGateway } from '@core/usecases/promotion-codes/promotion-code-listing/InMemoryPromotionCodeGateway'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import { createPinia, setActivePinia } from 'pinia'
import {
  CreatePromotionCodeDTO,
  PromotionCode,
  PromotionScope
} from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import { UUID } from '@core/types/types'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { ReductionType } from '@core/entities/promotion'
import { createPromotionCode } from './createPromotionCode'

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

  const givenNextUuidIs = (givenUuid: UUID) => {
    uuid = givenUuid
    uuidGenerator.setNext(uuid)
  }

  const whenCreatePromotionCode = async () => {
    await createPromotionCode(dto, promotionCodeGateway)
  }
})
