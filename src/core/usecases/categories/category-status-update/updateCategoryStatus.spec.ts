import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { Category } from '@core/entities/category'
import { updateCategoryStatus } from '@core/usecases/categories/category-status-update/updateCategoryStatus'
import { useCategoryStore } from '@store/categoryStore'
import { baby, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Update Category Status', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Updating status cascades to descendants', () => {
    beforeEach(async () => {
      givenExistingCategories(mum, baby)
      await updateCategoryStatus(mum.uuid, 'INACTIVE', categoryGateway)
    })

    it('updates parent category status in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === mum.uuid)?.status
      ).toStrictEqual('INACTIVE')
    })

    it('updates child category status in store', () => {
      expect(
        categoryStore.items.find((c) => c.uuid === baby.uuid)?.status
      ).toStrictEqual('INACTIVE')
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      givenExistingCategories(mum)
    })

    it('sets loading to false after completion', async () => {
      await updateCategoryStatus(mum.uuid, 'INACTIVE', categoryGateway)
      expect(categoryStore.isLoading).toStrictEqual(false)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }
})
