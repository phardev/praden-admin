import { createPinia, setActivePinia } from 'pinia'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { useProductStore } from '@store/productStore'
import { chamomilla, dolodent } from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { UUID } from '@core/types/types'
import { getProduct } from '@core/usecases/product/get-product/get-product'
import { ProductDoesNotExistsError } from '@core/errors/ProductDoesNotExistsError'

describe('Get product', () => {
  let productStore: any
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    productGateway = new InMemoryProductGateway()
  })

  describe('The product exists', () => {
    const product = dolodent
    beforeEach(async () => {
      givenExistingProducts(chamomilla, dolodent)
      await whenGetProduct(product.uuid)
    })
    it('should store the product in product store', () => {
      expectCurrentProductToBe(product)
    })
  })

  describe('The product does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetProduct('NotExists')).rejects.toThrow(
        ProductDoesNotExistsError
      )
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }
  const whenGetProduct = async (uuid: UUID): Promise<void> => {
    await getProduct(uuid, productGateway)
  }
  const expectCurrentProductToBe = (product: Product) => {
    expect(productStore.current).toStrictEqual(product)
  }
})
