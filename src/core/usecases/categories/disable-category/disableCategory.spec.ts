import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { CategoryStatus } from '@core/entities/category'
import type { CategoryGateway } from '@core/gateways/categoryGateway'
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

  describe('Disabling a single category', () => {
    it('should call gateway disable method', async () => {
      categoryGateway.feedWith(dents)
      categoryStore.list([dents])

      await whenDisableCategory(dents.uuid, categoryGateway)

      const categories = await categoryGateway.list()
      expect(categories[0].status).toBe(CategoryStatus.Inactive)
    })
  })

  describe('Store update', () => {
    it('should update store with all returned categories', async () => {
      categoryGateway.feedWith(dents)
      categoryStore.list([dents])

      await whenDisableCategory(dents.uuid, categoryGateway)

      expect(categoryStore.items[0].status).toBe(CategoryStatus.Inactive)
    })
  })

  describe('Disabling category with descendants', () => {
    it('should update parent category in store', async () => {
      categoryGateway.feedWith(mum, baby)
      categoryStore.list([mum, baby])

      await whenDisableCategory(mum.uuid, categoryGateway)

      expect(categoryStore.items.find((c) => c.uuid === mum.uuid)?.status).toBe(
        CategoryStatus.Inactive
      )
    })

    it('should update descendant categories in store', async () => {
      categoryGateway.feedWith(mum, baby)
      categoryStore.list([mum, baby])

      await whenDisableCategory(mum.uuid, categoryGateway)

      expect(
        categoryStore.items.find((c) => c.uuid === baby.uuid)?.status
      ).toBe(CategoryStatus.Inactive)
    })
  })

  describe('Loading state', () => {
    it('should set isLoading to true during operation', async () => {
      categoryGateway.feedWith(dents)
      categoryStore.list([dents])

      const unsubscribe = categoryStore.$subscribe(
        (mutation: unknown, state: typeof categoryStore.$state) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )

      await whenDisableCategory(dents.uuid, categoryGateway)
    })

    it('should set isLoading to false after operation completes', async () => {
      categoryGateway.feedWith(dents)
      categoryStore.list([dents])

      await whenDisableCategory(dents.uuid, categoryGateway)

      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const whenDisableCategory = async (
    uuid: string,
    gateway: CategoryGateway
  ) => {
    await disableCategory(uuid, gateway)
  }
})
