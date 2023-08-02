import { usePromotionStore } from '@store/promotionStore'
import { InMemoryPromotionGateway } from '@core/usecases/promotions/promotions-listing/inMemoryPromotionGateway'
import { createPromotion } from '@core/usecases/promotions/promotion-creation/createPromotion'
import {
  CreatePromotionDTO,
  Promotion,
  ReductionType
} from '@core/usecases/promotions/promotions-listing/promotion'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { promotionPercentageDolodent } from '@utils/testData/promotions'
import { FakeUuidGenerator } from '@adapters/secondary/fakeUuidGenerator'
import {
  PromotionNeedsProductError,
  PromotionReductionCannotExceed100Error
} from '@core/usecases/promotions/promotion-creation/promotionNeedProductError'

describe('Create promotion', () => {
  let promotionStore: any
  let promotionGateway: InMemoryPromotionGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
    promotionGateway = new InMemoryPromotionGateway(uuidGenerator)
  })
  describe('Simple promotion', () => {
    const promotion: CreatePromotionDTO = {
      name: 'PromoTest',
      products: [dolodent.cip13],
      type: ReductionType.Percentage,
      amount: 10
    }
    const uuid = 'abc123'
    const expectedPromotion: Promotion = {
      ...promotion,
      uuid
    }
    describe('Without previous promotions', () => {
      beforeEach(async () => {
        uuidGenerator.setNext(uuid)
        await whenCreatePromotion(promotion)
      })
      it('should create the promotion in promotion gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual([expectedPromotion])
      })
      it('should save the promotion in promotion store', () => {
        expect(promotionStore.items).toStrictEqual([expectedPromotion])
      })
    })
    describe('With already existing promotions', () => {
      const expectedPromotions = [
        promotionPercentageDolodent,
        expectedPromotion
      ]
      beforeEach(async () => {
        givenExistingPromotions(promotionPercentageDolodent)
        uuidGenerator.setNext(uuid)
        await whenCreatePromotion(promotion)
      })
      it('should create the promotion in promotion gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual(expectedPromotions)
      })
      it('should save the promotion in promotion store', () => {
        expect(promotionStore.items).toStrictEqual(expectedPromotions)
      })
    })
    describe('With other fields', () => {
      const uuid = 'def456'
      const promotion: CreatePromotionDTO = {
        name: 'PromoTest2',
        products: [calmosine.cip13, chamomilla.cip13, anaca3Minceur.cip13],
        type: ReductionType.Fixed,
        amount: 100
      }
      const expectedPromotion: Promotion = {
        ...promotion,
        uuid
      }
      const expectedPromotions = [
        promotionPercentageDolodent,
        expectedPromotion
      ]
      beforeEach(async () => {
        givenExistingPromotions(promotionPercentageDolodent)
        uuidGenerator.setNext(uuid)
        await whenCreatePromotion(promotion)
      })
      it('should create the promotion in promotion gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual(expectedPromotions)
      })
      it('should save the promotion in promotion store', () => {
        expect(promotionStore.items).toStrictEqual(expectedPromotions)
      })
    })
  })
  describe('Errors', () => {
    it('should throw an error if there is no products', async () => {
      const promotion: CreatePromotionDTO = {
        name: 'PromoTest',
        products: [],
        type: ReductionType.Percentage,
        amount: 10
      }
      await expect(whenCreatePromotion(promotion)).rejects.toThrow(
        PromotionNeedsProductError
      )
    })
    it('should throw an error if percentage is > 100%', async () => {
      const promotion: CreatePromotionDTO = {
        name: 'PromoTest',
        products: [dolodent.cip13],
        type: ReductionType.Percentage,
        amount: 101
      }
      await expect(whenCreatePromotion(promotion)).rejects.toThrow(
        PromotionReductionCannotExceed100Error
      )
    })
  })

  const givenExistingPromotions = (...promotions: Array<Promotion>) => {
    promotionGateway.feedWith(...promotions)
    promotionStore.items = promotions
  }

  const whenCreatePromotion = async (promotion: CreatePromotionDTO) => {
    await createPromotion(promotion, promotionGateway)
  }
})
