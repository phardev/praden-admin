import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
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

  describe('Disabling a category', () => {
    it('updates the store with all categories after disabling', async () => {
      categoryGateway.feedWith(dents, mum)
      categoryStore.list([dents, mum])

      await disableCategory(dents.uuid, categoryGateway)

      const updated = categoryStore.items.find((c) => c.uuid === dents.uuid)
      expect(updated?.status).toBe('INACTIVE')
    })

    it('disables category and its descendants', async () => {
      categoryGateway.feedWith(dents, mum, baby)
      categoryStore.list([dents, mum, baby])

      await disableCategory(mum.uuid, categoryGateway)

      const updatedMum = categoryStore.items.find((c) => c.uuid === mum.uuid)
      const updatedBaby = categoryStore.items.find((c) => c.uuid === baby.uuid)
      expect(updatedMum?.status).toBe('INACTIVE')
      expect(updatedBaby?.status).toBe('INACTIVE')
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      categoryGateway.feedWith(dents)
      categoryStore.list([dents])
    })

    it('sets loading to true during the call', async () => {
      const unsubscribe = categoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await disableCategory(dents.uuid, categoryGateway)
    })

    it('sets loading to false after the call', async () => {
      await disableCategory(dents.uuid, categoryGateway)
      expect(categoryStore.isLoading).toBe(false)
    })
  })
})
