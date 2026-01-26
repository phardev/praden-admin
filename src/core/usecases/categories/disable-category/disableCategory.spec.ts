import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category } from '@core/entities/category'
import { disableCategory } from '@core/usecases/categories/disable-category/disableCategory'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Disable category', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Disable single category', () => {
    beforeEach(async () => {
      givenExistingCategories(dents, mum, baby)
      await whenDisableCategory(dents.uuid)
    })

    it('should disable the category in the store', () => {
      const category = categoryStore.getByUuid(dents.uuid)
      expect(category?.status).toBe('INACTIVE')
    })
  })

  describe('Disable parent category with cascade', () => {
    beforeEach(async () => {
      givenExistingCategories(dents, mum, baby)
      await whenDisableCategory(mum.uuid)
    })

    it('should disable the parent category in the store', () => {
      const category = categoryStore.getByUuid(mum.uuid)
      expect(category?.status).toBe('INACTIVE')
    })

    it('should cascade disable to child category in the store', () => {
      const category = categoryStore.getByUuid(baby.uuid)
      expect(category?.status).toBe('INACTIVE')
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      givenExistingCategories(dents)
    })

    it('should be aware during loading', async () => {
      const unsubscribe = categoryStore.$subscribe(
        (_mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenDisableCategory(dents.uuid)
    })

    it('should be aware that loading is over', async () => {
      await whenDisableCategory(dents.uuid)
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }

  const whenDisableCategory = async (uuid: string): Promise<void> => {
    await disableCategory(uuid, categoryGateway)
  }
})
