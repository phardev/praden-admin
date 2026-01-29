import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { createPinia, setActivePinia } from 'pinia'
import { disableCategory } from './disableCategory'

describe('Disable Category', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('When disabling a category', () => {
    const activeCategory: Category = {
      uuid: 'cat-1',
      name: 'Category 1',
      description: 'Description 1',
      order: 0,
      status: 'ACTIVE'
    }

    beforeEach(async () => {
      categoryGateway.feedWith(activeCategory)
      categoryStore.items = [activeCategory]
      await disableCategory('cat-1', categoryGateway)
    })

    it('should update the category status to INACTIVE in the store', () => {
      const updated = categoryStore.getByUuid('cat-1')
      expect(updated?.status).toStrictEqual('INACTIVE')
    })
  })

  describe('When disabling a category with descendants', () => {
    const parentCategory: Category = {
      uuid: 'parent-1',
      name: 'Parent',
      description: 'Parent description',
      order: 0,
      status: 'ACTIVE'
    }
    const childCategory: Category = {
      uuid: 'child-1',
      name: 'Child',
      description: 'Child description',
      parentUuid: 'parent-1',
      order: 1,
      status: 'ACTIVE'
    }

    beforeEach(async () => {
      categoryGateway.feedWith(parentCategory, childCategory)
      categoryStore.items = [parentCategory, childCategory]
      await disableCategory('parent-1', categoryGateway)
    })

    it('should update the parent category status to INACTIVE in the store', () => {
      const updated = categoryStore.getByUuid('parent-1')
      expect(updated?.status).toStrictEqual('INACTIVE')
    })

    it('should update the child category status to INACTIVE in the store', () => {
      const updated = categoryStore.getByUuid('child-1')
      expect(updated?.status).toStrictEqual('INACTIVE')
    })
  })
})
