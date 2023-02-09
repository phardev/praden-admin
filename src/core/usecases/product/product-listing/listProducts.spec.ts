import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '@store/productStore'
import { InMemoryProductGateway } from '@adapters/secondary/inMemoryProductGateway'
import { listProducts } from './listProducts'
import { Product } from '@core/entities/product'
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
    it('should list all of them', async () => {
      givenExistingProducts(dolodent, ultraLevure)
      await whenListProducts()
      expectProductStoreToContains(dolodent, ultraLevure)
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
})
