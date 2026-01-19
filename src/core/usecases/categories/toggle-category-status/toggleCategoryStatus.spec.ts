import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category, CategoryStatus } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, minceur, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'
import { toggleCategoryStatus } from './toggleCategoryStatus'

describe('Toggle Category Status', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Toggle single category without children', () => {
    const activeCategory = { ...dents, status: CategoryStatus.Active }
    const inactiveCategory = { ...minceur, status: CategoryStatus.Inactive }

    beforeEach(() => {
      givenExistingCategories(activeCategory, inactiveCategory)
    })

    describe('Toggle active category to inactive', () => {
      beforeEach(async () => {
        await toggleCategoryStatus(activeCategory.uuid, categoryGateway)
      })

      it('should update status to inactive in gateway', async () => {
        const categories = await categoryGateway.list()
        const updated = categories.find((c) => c.uuid === activeCategory.uuid)
        expect(updated?.status).toBe(CategoryStatus.Inactive)
      })

      it('should update status to inactive in store', () => {
        const updated = categoryStore.items.find(
          (c) => c.uuid === activeCategory.uuid
        )
        expect(updated?.status).toBe(CategoryStatus.Inactive)
      })
    })

    describe('Toggle inactive category to active', () => {
      beforeEach(async () => {
        await toggleCategoryStatus(inactiveCategory.uuid, categoryGateway)
      })

      it('should update status to active in gateway', async () => {
        const categories = await categoryGateway.list()
        const updated = categories.find((c) => c.uuid === inactiveCategory.uuid)
        expect(updated?.status).toBe(CategoryStatus.Active)
      })

      it('should update status to active in store', () => {
        const updated = categoryStore.items.find(
          (c) => c.uuid === inactiveCategory.uuid
        )
        expect(updated?.status).toBe(CategoryStatus.Active)
      })
    })
  })

  describe('Toggle parent category with children (cascade)', () => {
    const parent = { ...mum, status: CategoryStatus.Active }
    const child = { ...baby, status: CategoryStatus.Active }

    beforeEach(() => {
      givenExistingCategories(parent, child)
    })

    describe('Disable parent cascades to children', () => {
      beforeEach(async () => {
        await toggleCategoryStatus(parent.uuid, categoryGateway)
      })

      it('should update parent status to inactive in gateway', async () => {
        const categories = await categoryGateway.list()
        const updated = categories.find((c) => c.uuid === parent.uuid)
        expect(updated?.status).toBe(CategoryStatus.Inactive)
      })

      it('should update child status to inactive in gateway', async () => {
        const categories = await categoryGateway.list()
        const updated = categories.find((c) => c.uuid === child.uuid)
        expect(updated?.status).toBe(CategoryStatus.Inactive)
      })

      it('should update parent status to inactive in store', () => {
        const updated = categoryStore.items.find((c) => c.uuid === parent.uuid)
        expect(updated?.status).toBe(CategoryStatus.Inactive)
      })

      it('should update child status to inactive in store', () => {
        const updated = categoryStore.items.find((c) => c.uuid === child.uuid)
        expect(updated?.status).toBe(CategoryStatus.Inactive)
      })
    })

    describe('Enable parent cascades to children', () => {
      const inactiveParent = { ...mum, status: CategoryStatus.Inactive }
      const inactiveChild = { ...baby, status: CategoryStatus.Inactive }

      beforeEach(async () => {
        givenExistingCategories(inactiveParent, inactiveChild)
        await toggleCategoryStatus(inactiveParent.uuid, categoryGateway)
      })

      it('should update parent status to active in gateway', async () => {
        const categories = await categoryGateway.list()
        const updated = categories.find((c) => c.uuid === inactiveParent.uuid)
        expect(updated?.status).toBe(CategoryStatus.Active)
      })

      it('should update child status to active in gateway', async () => {
        const categories = await categoryGateway.list()
        const updated = categories.find((c) => c.uuid === inactiveChild.uuid)
        expect(updated?.status).toBe(CategoryStatus.Active)
      })
    })
  })

  describe('Toggle parent with nested grandchildren', () => {
    const grandparent: Category = {
      uuid: 'grandparent',
      name: 'Grandparent',
      description: '',
      order: 0,
      status: CategoryStatus.Active
    }
    const parent: Category = {
      uuid: 'parent',
      name: 'Parent',
      description: '',
      parentUuid: grandparent.uuid,
      order: 1,
      status: CategoryStatus.Active
    }
    const child: Category = {
      uuid: 'child',
      name: 'Child',
      description: '',
      parentUuid: parent.uuid,
      order: 2,
      status: CategoryStatus.Active
    }

    beforeEach(async () => {
      givenExistingCategories(grandparent, parent, child)
      await toggleCategoryStatus(grandparent.uuid, categoryGateway)
    })

    it('should update grandparent status to inactive', async () => {
      const categories = await categoryGateway.list()
      const updated = categories.find((c) => c.uuid === grandparent.uuid)
      expect(updated?.status).toBe(CategoryStatus.Inactive)
    })

    it('should update parent status to inactive', async () => {
      const categories = await categoryGateway.list()
      const updated = categories.find((c) => c.uuid === parent.uuid)
      expect(updated?.status).toBe(CategoryStatus.Inactive)
    })

    it('should update child status to inactive', async () => {
      const categories = await categoryGateway.list()
      const updated = categories.find((c) => c.uuid === child.uuid)
      expect(updated?.status).toBe(CategoryStatus.Inactive)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }
})
