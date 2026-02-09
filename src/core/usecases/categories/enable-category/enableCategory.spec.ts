import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { CategoryStatus } from '@core/entities/category'
import type { CategoryGateway } from '@core/gateways/categoryGateway'
import { enableCategory } from '@core/usecases/categories/enable-category/enableCategory'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Enable category', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Enabling a single category', () => {
    it('should call gateway enable method', async () => {
      const inactiveCategory = {
        ...dents,
        status: CategoryStatus.Inactive
      }
      categoryGateway.feedWith(inactiveCategory)
      categoryStore.list([inactiveCategory])

      await whenEnableCategory(dents.uuid, categoryGateway)

      const categories = await categoryGateway.list()
      expect(categories[0].status).toBe(CategoryStatus.Active)
    })
  })

  describe('Store update', () => {
    it('should update store with all returned categories', async () => {
      const inactiveCategory = {
        ...dents,
        status: CategoryStatus.Inactive
      }
      categoryGateway.feedWith(inactiveCategory)
      categoryStore.list([inactiveCategory])

      await whenEnableCategory(dents.uuid, categoryGateway)

      expect(categoryStore.items[0].status).toBe(CategoryStatus.Active)
    })
  })

  describe('Enabling category with descendants', () => {
    it('should update all affected categories in store', async () => {
      const inactiveMum = { ...mum, status: CategoryStatus.Inactive }
      const inactiveBaby = { ...baby, status: CategoryStatus.Inactive }
      categoryGateway.feedWith(inactiveMum, inactiveBaby)
      categoryStore.list([inactiveMum, inactiveBaby])

      await whenEnableCategory(mum.uuid, categoryGateway)

      expect(categoryStore.items.find((c) => c.uuid === mum.uuid)?.status).toBe(
        CategoryStatus.Active
      )
    })

    it('should update descendant categories in store', async () => {
      const inactiveMum = { ...mum, status: CategoryStatus.Inactive }
      const inactiveBaby = { ...baby, status: CategoryStatus.Inactive }
      categoryGateway.feedWith(inactiveMum, inactiveBaby)
      categoryStore.list([inactiveMum, inactiveBaby])

      await whenEnableCategory(mum.uuid, categoryGateway)

      expect(
        categoryStore.items.find((c) => c.uuid === baby.uuid)?.status
      ).toBe(CategoryStatus.Active)
    })
  })

  describe('Loading state', () => {
    it('should set isLoading to true during operation', async () => {
      const inactiveCategory = {
        ...dents,
        status: CategoryStatus.Inactive
      }
      categoryGateway.feedWith(inactiveCategory)
      categoryStore.list([inactiveCategory])

      const unsubscribe = categoryStore.$subscribe(
        (mutation: unknown, state: typeof categoryStore.$state) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )

      await whenEnableCategory(dents.uuid, categoryGateway)
    })

    it('should set isLoading to false after operation completes', async () => {
      const inactiveCategory = {
        ...dents,
        status: CategoryStatus.Inactive
      }
      categoryGateway.feedWith(inactiveCategory)
      categoryStore.list([inactiveCategory])

      await whenEnableCategory(dents.uuid, categoryGateway)

      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const whenEnableCategory = async (uuid: string, gateway: CategoryGateway) => {
    await enableCategory(uuid, gateway)
  }
})
