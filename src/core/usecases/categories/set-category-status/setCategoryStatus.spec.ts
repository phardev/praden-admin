import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { Category, CategoryStatus } from '@core/entities/category'
import { setCategoryStatus } from '@core/usecases/categories/set-category-status/setCategoryStatus'
import { useCategoryStore } from '@store/categoryStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Set category status', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  const parent: Category = {
    uuid: 'category-parent',
    name: 'Parent',
    description: 'Parent category',
    status: 'ACTIVE',
    order: 0
  }

  const child1: Category = {
    uuid: 'category-child1',
    name: 'Child 1',
    description: 'Child 1 category',
    parentUuid: parent.uuid,
    status: 'ACTIVE',
    order: 1
  }

  const child2: Category = {
    uuid: 'category-child2',
    name: 'Child 2',
    description: 'Child 2 category',
    parentUuid: parent.uuid,
    status: 'ACTIVE',
    order: 2
  }

  const grandchild: Category = {
    uuid: 'category-grandchild',
    name: 'Grandchild',
    description: 'Grandchild category',
    parentUuid: child1.uuid,
    status: 'ACTIVE',
    order: 3
  }

  const leaf: Category = {
    uuid: 'category-leaf',
    name: 'Leaf',
    description: 'Leaf category (no children)',
    status: 'ACTIVE',
    order: 4
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Setting status on leaf category', () => {
    beforeEach(async () => {
      givenExistingCategories(parent, child1, child2, grandchild, leaf)
      await whenSetCategoryStatus(leaf.uuid, 'INACTIVE')
    })
    it('should only update the leaf category status in the store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === leaf.uuid)?.status
      ).toBe('INACTIVE')
    })
    it('should not affect parent category status', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === parent.uuid)?.status
      ).toBe('ACTIVE')
    })
  })

  describe('Disabling parent disables all descendants', () => {
    beforeEach(async () => {
      givenExistingCategories(parent, child1, child2, grandchild, leaf)
      await whenSetCategoryStatus(parent.uuid, 'INACTIVE')
    })
    it('should disable parent in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === parent.uuid)?.status
      ).toBe('INACTIVE')
    })
    it('should disable child1 in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === child1.uuid)?.status
      ).toBe('INACTIVE')
    })
    it('should disable child2 in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === child2.uuid)?.status
      ).toBe('INACTIVE')
    })
    it('should disable grandchild in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === grandchild.uuid)?.status
      ).toBe('INACTIVE')
    })
    it('should not affect unrelated leaf category', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === leaf.uuid)?.status
      ).toBe('ACTIVE')
    })
  })

  describe('Enabling parent enables all descendants', () => {
    const inactiveParent: Category = { ...parent, status: 'INACTIVE' }
    const inactiveChild1: Category = { ...child1, status: 'INACTIVE' }
    const inactiveChild2: Category = { ...child2, status: 'INACTIVE' }
    const inactiveGrandchild: Category = { ...grandchild, status: 'INACTIVE' }

    beforeEach(async () => {
      givenExistingCategories(
        inactiveParent,
        inactiveChild1,
        inactiveChild2,
        inactiveGrandchild,
        leaf
      )
      await whenSetCategoryStatus(inactiveParent.uuid, 'ACTIVE')
    })
    it('should enable parent in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === parent.uuid)?.status
      ).toBe('ACTIVE')
    })
    it('should enable child1 in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === child1.uuid)?.status
      ).toBe('ACTIVE')
    })
    it('should enable child2 in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === child2.uuid)?.status
      ).toBe('ACTIVE')
    })
    it('should enable grandchild in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === grandchild.uuid)?.status
      ).toBe('ACTIVE')
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenExistingCategories(leaf)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = categoryStore.$subscribe(
        (mutation: unknown, state: typeof categoryStore.$state) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenSetCategoryStatus(leaf.uuid, 'INACTIVE')
    })
    it('should be aware that loading is over', async () => {
      await whenSetCategoryStatus(leaf.uuid, 'INACTIVE')
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }

  const whenSetCategoryStatus = async (
    uuid: string,
    status: CategoryStatus
  ): Promise<void> => {
    await setCategoryStatus(uuid, status, categoryGateway)
  }
})
