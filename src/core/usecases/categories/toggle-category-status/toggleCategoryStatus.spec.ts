import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { Category } from '@core/entities/category'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { toggleCategoryStatus } from '@core/usecases/categories/toggle-category-status/toggleCategoryStatus'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Toggle Category Status', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Toggle single category without children', () => {
    beforeEach(async () => {
      givenExistingCategories(dents)
      await whenToggleStatus(dents.uuid, 'INACTIVE')
    })

    it('should update the category status in the store', () => {
      expect(categoryStore.items[0].status).toStrictEqual('INACTIVE')
    })
  })

  describe('Toggle parent category with children', () => {
    beforeEach(async () => {
      givenExistingCategories(mum, baby)
      await whenToggleStatus(mum.uuid, 'INACTIVE')
    })

    it('should update the parent category status', () => {
      const parentCategory = categoryStore.items.find(
        (c) => c.uuid === mum.uuid
      )
      expect(parentCategory?.status).toStrictEqual('INACTIVE')
    })

    it('should update the child category status', () => {
      const childCategory = categoryStore.items.find(
        (c) => c.uuid === baby.uuid
      )
      expect(childCategory?.status).toStrictEqual('INACTIVE')
    })
  })

  describe('Toggle category back to active', () => {
    beforeEach(async () => {
      const inactiveCategory: Category = { ...dents, status: 'INACTIVE' }
      givenExistingCategories(inactiveCategory)
      await whenToggleStatus(dents.uuid, 'ACTIVE')
    })

    it('should update the category status to active', () => {
      expect(categoryStore.items[0].status).toStrictEqual('ACTIVE')
    })
  })

  describe('Toggle non-existent category', () => {
    beforeEach(() => {
      givenExistingCategories(dents)
    })

    it('should throw CategoryDoesNotExistsError', async () => {
      await expect(
        whenToggleStatus('non-existent', 'INACTIVE')
      ).rejects.toThrow(CategoryDoesNotExistsError)
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      givenExistingCategories(dents)
    })

    it('should be aware during loading', async () => {
      const unsubscribe = categoryStore.$subscribe(
        (mutation: unknown, state: { isLoading: boolean }) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenToggleStatus(dents.uuid, 'INACTIVE')
    })

    it('should be aware that loading is over', async () => {
      await whenToggleStatus(dents.uuid, 'INACTIVE')
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }

  const whenToggleStatus = async (
    uuid: string,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<void> => {
    await toggleCategoryStatus(uuid, status, categoryGateway)
  }
})
