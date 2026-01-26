import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category, CategoryStatus } from '@core/entities/category'
import { enableCategory } from '@core/usecases/categories/enable-category/enableCategory'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Enable Category', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Enable a single category', () => {
    beforeEach(async () => {
      const inactiveCategory = { ...dents, status: CategoryStatus.Inactive }
      givenExistingCategories(inactiveCategory)
      await whenEnableCategory(dents.uuid)
    })

    it('should update the category status to active in the store', () => {
      const category = categoryStore.items.find((c) => c.uuid === dents.uuid)
      expect(category?.status).toBe(CategoryStatus.Active)
    })
  })

  describe('Enable a category with children', () => {
    beforeEach(async () => {
      const inactiveParent = { ...mum, status: CategoryStatus.Inactive }
      const inactiveChild = { ...baby, status: CategoryStatus.Inactive }
      givenExistingCategories(inactiveParent, inactiveChild)
      await whenEnableCategory(mum.uuid)
    })

    it('should enable the parent category', () => {
      const parent = categoryStore.items.find((c) => c.uuid === mum.uuid)
      expect(parent?.status).toBe(CategoryStatus.Active)
    })

    it('should enable the child category', () => {
      const child = categoryStore.items.find((c) => c.uuid === baby.uuid)
      expect(child?.status).toBe(CategoryStatus.Active)
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      const inactiveCategory = { ...dents, status: CategoryStatus.Inactive }
      givenExistingCategories(inactiveCategory)
    })

    it('should set loading to false after completion', async () => {
      await whenEnableCategory(dents.uuid)
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }

  const whenEnableCategory = async (uuid: string): Promise<void> => {
    await enableCategory(uuid, categoryGateway)
  }
})
