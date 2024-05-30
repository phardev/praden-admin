import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UUID } from '@core/types/types'
import { createPinia, setActivePinia } from 'pinia'
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { useCategoryStore } from '@store/categoryStore'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { dents } from '@utils/testData/categories'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'

describe('Get category', () => {
  let categoryStore: any
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })
  describe('The category exists', () => {
    beforeEach(async () => {
      categoryGateway.feedWith(dents)
      await whenGetCategory(dents.uuid)
    })
    it('should store it in category store', () => {
      expect(categoryStore.current).toStrictEqual(dents)
    })
  })
  describe('The category does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetCategory('NotExists')).rejects.toThrow(
        CategoryDoesNotExistsError
      )
    })
  })
  const whenGetCategory = async (uuid: UUID) => {
    await getCategory(uuid, categoryGateway)
  }
})
