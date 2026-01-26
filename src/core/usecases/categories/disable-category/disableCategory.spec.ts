import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category, CategoryStatus } from '@core/entities/category'
import { disableCategory } from '@core/usecases/categories/disable-category/disableCategory'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Disable Category', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Disable a single category', () => {
    beforeEach(async () => {
      givenExistingCategories(dents)
      await whenDisableCategory(dents.uuid)
    })

    it('should update the category status to inactive in the store', () => {
      const category = categoryStore.items.find((c) => c.uuid === dents.uuid)
      expect(category?.status).toBe(CategoryStatus.Inactive)
    })
  })

  describe('Disable a category with children', () => {
    beforeEach(async () => {
      givenExistingCategories(mum, baby)
      await whenDisableCategory(mum.uuid)
    })

    it('should disable the parent category', () => {
      const parent = categoryStore.items.find((c) => c.uuid === mum.uuid)
      expect(parent?.status).toBe(CategoryStatus.Inactive)
    })

    it('should disable the child category', () => {
      const child = categoryStore.items.find((c) => c.uuid === baby.uuid)
      expect(child?.status).toBe(CategoryStatus.Inactive)
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      givenExistingCategories(dents)
    })

    it('should set loading to false after completion', async () => {
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
