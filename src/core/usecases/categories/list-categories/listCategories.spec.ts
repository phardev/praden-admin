import { createPinia, setActivePinia } from 'pinia'
import { useCategoryStore } from '@store/categoryStore'
import { dents, diarrhee } from '@utils/testData/categories'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

describe('List categories', () => {
  let categoryStore: any
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })
  describe('There is no categories', () => {
    it('should list nothing', async () => {
      await whenListCategories()
      expect(categoryStore.items).toStrictEqual([])
    })
  })
  describe('There is some categories', () => {
    it('should list all of them', async () => {
      categoryGateway.feedWith(dents, diarrhee)
      await whenListCategories()
      expect(categoryStore.items).toStrictEqual([dents, diarrhee])
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      categoryGateway.feedWith(dents)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = categoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListCategories()
    })
    it('should be aware that loading is over', async () => {
      await whenListCategories()
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  describe('Request deduplication', () => {
    beforeEach(() => {
      categoryGateway.feedWith(dents, diarrhee)
    })
    it('should prevent duplicate concurrent requests', async () => {
      categoryStore.startLoading()
      await whenListCategories()
      expect(categoryStore.items).toStrictEqual([])
    })
    it('should allow request when not loading', async () => {
      await whenListCategories()
      expect(categoryStore.items).toStrictEqual([dents, diarrhee])
    })
  })

  const whenListCategories = async () => {
    await listCategories(categoryGateway)
  }
})
