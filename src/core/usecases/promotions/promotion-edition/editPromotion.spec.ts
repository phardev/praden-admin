import { usePromotionStore } from '@store/promotionStore'
import { createPinia, setActivePinia } from 'pinia'
import { InMemoryPromotionGateway } from '@adapters/secondary/inMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/fakeUuidGenerator'
import {
  EditPromotionDTO,
  Promotion,
  ReductionType
} from '@core/entities/promotion'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import { calmosine } from '@utils/testData/products'
import { editPromotion } from '@core/usecases/promotions/promotion-edition/editPromotion'
import { UUID } from '@core/types/types'
import { PromotionDoesNotExistsError } from '@core/errors/PromotionDoesNotExistsError'

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
        products: [calmosine.cip13],
        startDate: 123456789,
        endDate: 987654321
      }
      const expectedPromotion: Promotion = {
        uuid: promotionPercentageDolodent.uuid,
        name: 'New name',
        type: ReductionType.Fixed,
        amount: 150,
        products: [calmosine.cip13],
        startDate: 123456789,
        endDate: 987654321
      }
      const expectedRes = [expectedPromotion, promotionFixedMultipleProducts]
      beforeEach(async () => {
        await whenEditPromotion(expectedPromotion.uuid, dto)
      })
      it('should save the promotion in gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual(expectedRes)
      })
      it('should save the promotion in store', () => {
        expect(promotionStore.items).toStrictEqual(expectedRes)
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
      beforeEach(async () => {
        await whenEditPromotion(expectedPromotion.uuid, dto)
      })
      const expectedRes = [expectedPromotion, promotionFixedMultipleProducts]
      it('should save the promotion in gateway', async () => {
        expect(await promotionGateway.list()).toStrictEqual(expectedRes)
      })
      it('should save the promotion in store', () => {
        expect(promotionStore.items).toStrictEqual(expectedRes)
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
    promotionStore.items = JSON.parse(JSON.stringify(promotions))
  }
  const whenEditPromotion = async (uuid: UUID, dto: EditPromotionDTO) => {
    await editPromotion(uuid, dto, promotionGateway)
  }
})
