import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UUID } from '@core/types/types'
import { createPinia, setActivePinia } from 'pinia'
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { useCategoryStore } from '@store/categoryStore'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { dents } from '@utils/testData/categories'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { Product } from '@core/entities/product'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'

describe('Get category', () => {
  let categoryStore: any
  let categoryGateway: InMemoryCategoryGateway
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
  })
  describe('The category exists and there is no products inside', () => {
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
  describe('The category exists and there is some products', () => {
    beforeEach(async () => {
      givenExistingProducts(dolodent, ultraLevure, chamomilla)
      categoryGateway.feedWith(dents)
      await whenGetCategory(dents.uuid)
    })
    it('should store it in category store', () => {
      expect(categoryStore.current).toStrictEqual({
        category: dents,
        products: [dolodent, chamomilla]
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
  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }
  const whenGetCategory = async (uuid: UUID) => {
    await getCategory(uuid, categoryGateway, productGateway)
  }
})
