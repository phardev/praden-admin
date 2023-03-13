import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '@store/productStore'
import { InMemoryProductGateway } from '@adapters/secondary/inMemoryProductGateway'
import { listProducts } from './listProducts'
import { Product, Stock } from '@core/entities/product'
import { dolodent, ultraLevure } from '@utils/testData/products'

describe('List products', () => {
  let productStore: any
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    productGateway = new InMemoryProductGateway()
  })
  describe('There is no products', () => {
    it('should list nothing', async () => {
      await whenListProducts()
      expectProductStoreToContains()
    })
  })
  describe('There is some products', () => {
    beforeEach(async () => {
      givenExistingProducts(dolodent, ultraLevure)
      await whenListProducts()
    })
    it('should list all of them', () => {
      expectProductStoreToContains(dolodent, ultraLevure)
    })
    it('should retrieve available stock', async () => {
      const expectedStock: Stock = {
        [dolodent.cip13]: dolodent.availableStock,
        [ultraLevure.cip13]: ultraLevure.availableStock
      }
      expectStockToEqual(expectedStock)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }

  const whenListProducts = async () => {
    await listProducts(productGateway)
  }

  const expectProductStoreToContains = (...products: Array<Product>) => {
    expect(productStore.items).toStrictEqual(products)
  }

  const expectStockToEqual = (expectedStock: Stock) => {
    expect(productStore.stock).toStrictEqual(expectedStock)
  }
})
