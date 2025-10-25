import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  EditPromotionDTO,
  Promotion,
  ReductionType
} from '@core/entities/promotion'
import { PromotionDoesNotExistsError } from '@core/errors/PromotionDoesNotExistsError'
import { editPromotion } from '@core/usecases/promotions/promotion-edition/editPromotion'
import { usePromotionStore } from '@store/promotionStore'
import { promotionFixedMultipleProductsListItem } from '@utils/testData/fixtures/promotions/promotionListItems'
import { calmosine } from '@utils/testData/products'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import { createPinia, setActivePinia } from 'pinia'
import { PromotionListItem } from '../promotions-listing/promotionListItem'

describe('Edit promotion', () => {
  let promotionStore: any
  let promotionGateway: InMemoryPromotionGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
    promotionGateway = new InMemoryPromotionGateway(new FakeUuidGenerator())
  })
  describe('The promotion exists', () => {
    beforeEach(() => {
      givenPromotionsExists(
        promotionPercentageDolodent,
        promotionFixedMultipleProducts
      )
    })
    describe('Update all fields', () => {
      const dto: EditPromotionDTO = {
        name: 'New name',
        type: ReductionType.Fixed,
        amount: 150,
        products: [calmosine],
        startDate: 123456789,
        endDate: 987654321
      }
      const expectedPromotion: Promotion = {
        uuid: promotionPercentageDolodent.uuid,
        name: 'New name',
        type: ReductionType.Fixed,
        amount: 150,
        products: [calmosine],
        startDate: dto.startDate,
        endDate: dto.endDate
      }
      const expectedPromotionListItems = [
        {
          uuid: expectedPromotion.uuid,
          name: 'New name',
          type: ReductionType.Fixed,
          amount: 150,
          startDate: dto.startDate,
          endDate: dto.endDate,
          productCount: 1
        },
        promotionFixedMultipleProductsListItem
      ]
      beforeEach(async () => {
        await whenEditPromotion(expectedPromotion.uuid, dto)
      })
      it('should save the promotion in gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual(
          expectedPromotionListItems
        )
      })
      it('should save the promotion in store', () => {
        expect(promotionStore.items).toStrictEqual(expectedPromotionListItems)
      })
    })
    describe('Update some fields', () => {
      const dto: EditPromotionDTO = {
        name: 'New name',
        amount: 15
      }
      const expectedPromotion: Promotion = {
        ...promotionPercentageDolodent,
        name: 'New name',
        amount: 15
      }
      const expectedPromotionListItem: PromotionListItem = {
        uuid: promotionPercentageDolodent.uuid,
        name: 'New name',
        type: ReductionType.Percentage,
        amount: 15,
        startDate: promotionPercentageDolodent.startDate,
        endDate: promotionPercentageDolodent.endDate,
        productCount: 1
      }

      const expectedPromotionListItems = [
        expectedPromotionListItem,
        promotionFixedMultipleProductsListItem
      ]

      beforeEach(async () => {
        await whenEditPromotion(expectedPromotion.uuid, dto)
      })
      it('should save the promotion in gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual(
          expectedPromotionListItems
        )
      })
      it('should save the promotion in store', () => {
        expect(promotionStore.items).toStrictEqual(expectedPromotionListItems)
      })
    })
  })
  describe('The promotion does not exists', () => {
    it('should throw an error', async () => {
      await expect(
        whenEditPromotion('NotExists', { name: 'NewName' })
      ).rejects.toThrow(PromotionDoesNotExistsError)
    })
  })
  const givenPromotionsExists = (...promotions: Array<Promotion>) => {
    promotionGateway.feedWith(...JSON.parse(JSON.stringify(promotions)))
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
  const whenEditPromotion = async (uuid: string, dto: EditPromotionDTO) => {
    await editPromotion(uuid, dto, promotionGateway)
  }
})
