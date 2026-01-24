import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { CategoryStatus } from '@core/entities/category'
import { toggleCategoryStatus } from '@core/usecases/categories/toggle-category-status/toggleCategoryStatus'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Toggle category status', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Toggle single category without cascade', () => {
    it('should toggle category from ACTIVE to INACTIVE', async () => {
      categoryGateway.feedWith(dents)
      categoryStore.list([dents])
      await toggleCategoryStatus(dents.uuid, false, categoryGateway)
      expect(categoryStore.items[0].status).toStrictEqual(
        CategoryStatus.Inactive
      )
    })
  })

  describe('Toggle with cascade', () => {
    it('should toggle parent and child categories', async () => {
      categoryGateway.feedWith(mum, baby)
      categoryStore.list([mum, baby])
      await toggleCategoryStatus(mum.uuid, true, categoryGateway)
      expect(categoryStore.items[0].status).toStrictEqual(
        CategoryStatus.Inactive
      )
    })
  })

  describe('Loading state', () => {
    it('should be aware during loading', async () => {
      categoryGateway.feedWith(dents)
      categoryStore.list([dents])
      const unsubscribe = categoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await toggleCategoryStatus(dents.uuid, false, categoryGateway)
    })

    it('should be aware that loading is over', async () => {
      categoryGateway.feedWith(dents)
      categoryStore.list([dents])
      await toggleCategoryStatus(dents.uuid, false, categoryGateway)
      expect(categoryStore.isLoading).toBe(false)
    })
  })
})
