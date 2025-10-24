import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Product } from '@core/entities/product'
import { UUID } from '@core/types/types'
import { listCategoryProducts } from '@core/usecases/categories/list-category-products/listCategoryProducts'
import { useCategoryStore } from '@store/categoryStore'
import { dents } from '@utils/testData/categories'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('List category products', () => {
  let categoryStore: any
  let productGateway: InMemoryProductGateway
  const defaultLimit = 50
  const defaultOffset = 0

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
  })
  describe('There is some products', () => {
    beforeEach(async () => {
      givenExistingProducts(dolodent, ultraLevure, chamomilla)
      await whenListCategoryProducts(dents.uuid)
    })
    it('should store it in category store', () => {
      expect(categoryStore.current).toMatchObject({
        products: [dolodent, chamomilla]
      })
    })
  })
  describe('There is some products already loaded', () => {
    beforeEach(async () => {
      categoryStore.current = { products: [dolodent] }
      givenExistingProducts(dolodent, ultraLevure, chamomilla)
      await whenListCategoryProducts(dents.uuid)
    })
    it('should store it in category store', () => {
      expect(categoryStore.current).toMatchObject({
        products: [dolodent, chamomilla]
      })
    })
  })
  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }
  const whenListCategoryProducts = async (
    categoryUuid: UUID,
    limit?: number,
    offset?: number
  ) => {
    await listCategoryProducts(
      limit || defaultLimit,
      offset || defaultOffset,
      categoryUuid,
      productGateway
    )
  }
})
