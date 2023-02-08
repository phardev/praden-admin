import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '../../../../store/productStore'
import { InMemoryProductGateway } from '../../../../adapters/secondary/inMemoryProductGateway'
import { listProducts } from './listProducts'
import { Product } from '../../../entities/product'

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
      const dolodent: Product = {
        name: 'Dolodent solution 27g',
        img: 'https://www.pharmacieagnespraden.com/img/tmp/product_mini_195_1.jpg',
        categoryUuid: 'category-dent',
        cip13: '3400921929201',
        priceWithoutTax: 500,
        percentTaxRate: 10,
        availableStock: 59
      }
      const ultraLevure: Product = {
        name: 'Ultra levure 200 mg 10 gélules',
        img: 'img-dolodent',
        categoryUuid: 'category-diarrhee',
        cip13: '3400922096612',
        priceWithoutTax: 432,
        percentTaxRate: 10,
        availableStock: 36
      }
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
