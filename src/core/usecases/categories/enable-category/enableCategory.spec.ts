import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
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

  describe('Enabling a category', () => {
    it('updates the store with all categories after enabling', async () => {
      const inactiveCategory = { ...dents, status: 'INACTIVE' as const }
      categoryGateway.feedWith(inactiveCategory, mum)
      categoryStore.list([inactiveCategory, mum])

      await enableCategory(dents.uuid, categoryGateway)

      const updated = categoryStore.items.find((c) => c.uuid === dents.uuid)
      expect(updated?.status).toBe('ACTIVE')
    })

    it('enables category and its descendants', async () => {
      const inactiveMum = { ...mum, status: 'INACTIVE' as const }
      const inactiveBaby = { ...baby, status: 'INACTIVE' as const }
      categoryGateway.feedWith(dents, inactiveMum, inactiveBaby)
      categoryStore.list([dents, inactiveMum, inactiveBaby])

      await enableCategory(mum.uuid, categoryGateway)

      const updatedMum = categoryStore.items.find((c) => c.uuid === mum.uuid)
      const updatedBaby = categoryStore.items.find((c) => c.uuid === baby.uuid)
      expect(updatedMum?.status).toBe('ACTIVE')
      expect(updatedBaby?.status).toBe('ACTIVE')
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
      await enableCategory(dents.uuid, categoryGateway)
    })

    it('sets loading to false after the call', async () => {
      await enableCategory(dents.uuid, categoryGateway)
      expect(categoryStore.isLoading).toBe(false)
    })
  })
})
