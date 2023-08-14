import { createPinia, setActivePinia } from 'pinia'
import { useCategoryStore } from '@store/categoryStore'
import { dents, diarrhee } from '@utils/testData/categories'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { InMemoryCategoryGateway } from '@adapters/secondary/InMemoryCategoryGateway'

describe('List categories', () => {
  let categoryStore: any
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway()
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

  const whenListCategories = async () => {
    await listCategories(categoryGateway)
  }
})
