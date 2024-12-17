import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UUID } from '@core/types/types'
import { createPinia, setActivePinia } from 'pinia'
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { useCategoryStore } from '@store/categoryStore'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { dents } from '@utils/testData/categories'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { dolodent } from '@utils/testData/products'

describe('Get category', () => {
  let categoryStore: any
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })
  describe('The category exists', () => {
    beforeEach(async () => {
      categoryGateway.feedWith(dents)
      await whenGetCategory(dents.uuid)
    })
    it('should store it in category store', () => {
      expect(categoryStore.current).toStrictEqual({
        category: dents,
        products: []
      })
    })
  })
  describe('There is some products already loaded', () => {
    beforeEach(async () => {
      categoryStore.current = { products: [dolodent] }
      categoryGateway.feedWith(dents)
      await whenGetCategory(dents.uuid)
    })
    it('should store the category and keep products', () => {
      expect(categoryStore.current).toStrictEqual({
        category: dents,
        products: [dolodent]
      })
    })
  })
  describe('The category does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetCategory('NotExists')).rejects.toThrow(
        CategoryDoesNotExistsError
      )
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
      await whenGetCategory(dents.uuid)
    })
    it('should be aware that loading is over', async () => {
      await whenGetCategory(dents.uuid)
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const whenGetCategory = async (uuid: UUID) => {
    await getCategory(uuid, categoryGateway)
  }
})
