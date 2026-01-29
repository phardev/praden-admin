import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { createPinia, setActivePinia } from 'pinia'
import { enableCategory } from './enableCategory'

describe('Enable Category', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('When enabling a category', () => {
    const inactiveCategory: Category = {
      uuid: 'cat-1',
      name: 'Category 1',
      description: 'Description 1',
      order: 0,
      status: 'INACTIVE'
    }

    beforeEach(async () => {
      categoryGateway.feedWith(inactiveCategory)
      categoryStore.items = [inactiveCategory]
      await enableCategory('cat-1', categoryGateway)
    })

    it('should update the category status to ACTIVE in the store', () => {
      const updated = categoryStore.getByUuid('cat-1')
      expect(updated?.status).toStrictEqual('ACTIVE')
    })
  })

  describe('When enabling a category with descendants', () => {
    const parentCategory: Category = {
      uuid: 'parent-1',
      name: 'Parent',
      description: 'Parent description',
      order: 0,
      status: 'INACTIVE'
    }
    const childCategory: Category = {
      uuid: 'child-1',
      name: 'Child',
      description: 'Child description',
      parentUuid: 'parent-1',
      order: 1,
      status: 'INACTIVE'
    }

    beforeEach(async () => {
      categoryGateway.feedWith(parentCategory, childCategory)
      categoryStore.items = [parentCategory, childCategory]
      await enableCategory('parent-1', categoryGateway)
    })

    it('should update the parent category status to ACTIVE in the store', () => {
      const updated = categoryStore.getByUuid('parent-1')
      expect(updated?.status).toStrictEqual('ACTIVE')
    })

    it('should update the child category status to ACTIVE in the store', () => {
      const updated = categoryStore.getByUuid('child-1')
      expect(updated?.status).toStrictEqual('ACTIVE')
    })
  })
})
