import { usePromotionStore } from '@store/promotionStore'
import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { createPromotion } from '@core/usecases/promotions/promotion-creation/createPromotion'
import {
  CreatePromotionDTO,
  Promotion,
  ReductionType
} from '@core/entities/promotion'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { promotionPercentageDolodent } from '@utils/testData/promotions'
import { promotionPercentageDolodentListItem } from '@utils/testData/fixtures/promotions/promotionListItems'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  PromotionNeedsProductError,
  PromotionReductionCannotExceed100Error
} from '@core/errors/PromotionNeedProductError'
import { PromotionListItem } from '@core/usecases/promotions/promotions-listing/promotionListItem'

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
      products: [dolodent],
      type: ReductionType.Percentage,
      amount: 10
    }
    const uuid = 'abc123'
    const expectedPromotionListItem: PromotionListItem = {
      uuid,
      name: 'PromoTest',
      type: ReductionType.Percentage,
      amount: 10,
      productCount: 1
    }
    describe('Without previous promotions', () => {
      beforeEach(async () => {
        uuidGenerator.setNext(uuid)
        await whenCreatePromotion(promotion)
      })
      it('should create the promotion in promotion gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual([
          expectedPromotionListItem
        ])
      })
      it('should save the promotion in promotion store', () => {
        expect(promotionStore.items).toStrictEqual([expectedPromotionListItem])
      })
    })
    describe('With already existing promotions', () => {
      const expectedPromotionListItems = [
        promotionPercentageDolodentListItem,
        expectedPromotionListItem
      ]
      beforeEach(async () => {
        givenExistingPromotions(promotionPercentageDolodent)
        uuidGenerator.setNext(uuid)
        await whenCreatePromotion(promotion)
      })
      it('should create the promotion in promotion gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual(
          expectedPromotionListItems
        )
      })
      it('should save the promotion in promotion store', () => {
        expect(promotionStore.items).toStrictEqual(expectedPromotionListItems)
      })
    })
    describe('With other fields', () => {
      const uuid = 'def456'
      const promotion: CreatePromotionDTO = {
        name: 'PromoTest2',
        products: [calmosine, chamomilla, anaca3Minceur],
        type: ReductionType.Fixed,
        amount: 100
      }
      const expectedPromotionListItem: PromotionListItem = {
        uuid,
        name: 'PromoTest2',
        type: ReductionType.Fixed,
        amount: 100,
        productCount: 3
      }
      const expectedPromotionListItems = [
        promotionPercentageDolodentListItem,
        expectedPromotionListItem
      ]
      beforeEach(async () => {
        givenExistingPromotions(promotionPercentageDolodent)
        uuidGenerator.setNext(uuid)
        await whenCreatePromotion(promotion)
      })
      it('should create the promotion in promotion gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual(
          expectedPromotionListItems
        )
      })
      it('should save the promotion in promotion store', () => {
        expect(promotionStore.items).toStrictEqual(expectedPromotionListItems)
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
        products: [dolodent],
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
    promotionStore.items = promotions.map((p) => ({
      uuid: p.uuid,
      name: p.name,
      type: p.type,
      amount: p.amount,
      startDate: p.startDate,
      endDate: p.endDate,
      productCount: p.products.length
    }))
  }

  const whenCreatePromotion = async (promotion: CreatePromotionDTO) => {
    await createPromotion(promotion, promotionGateway)
  }
})
