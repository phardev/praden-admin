import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '@store/productStore'
import {
  createProduct,
  CreateProductDTO
} from '@core/usecases/product/product-creation/createProduct'
import { Product } from '@core/entities/product'
import { dolodent, hemoclar } from '@utils/testData/products'

describe('Add product', () => {
  let productStore: any
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    productGateway = new InMemoryProductGateway()
  })
  describe('Simple product', () => {
    describe('For a product', () => {
      const dto: CreateProductDTO = {
        name: 'Created product',
        cip13: '1234567890123',
        img: 'created-product-img',
        miniature: 'created-product-miniature',
        categoryUuid: 'category-uuid',
        priceWithoutTax: 100,
        percentTaxRate: 10,
        location: 'product-location',
        availableStock: 12,
        laboratory: 'product-laboratory'
      }
      const expectedProduct: Product = {
        ...dto
      }
      beforeEach(async () => {
        await whenCreateProduct(dto)
      })
      it('should save the product in product gateway', async () => {
        await expectProductGatewayToEqual(expectedProduct)
      })
      it('should save the product in product store', async () => {
        await expectProductStoreToEqual(expectedProduct)
      })
    })
    describe('For another product', () => {
      const dto: CreateProductDTO = {
        name: 'Another created product',
        cip13: '0987654321098',
        img: 'another-created-product-img',
        miniature: 'another-created-product-miniature',
        categoryUuid: 'another-category-uuid',
        priceWithoutTax: 200,
        percentTaxRate: 20,
        location: 'another-product-location',
        availableStock: 21,
        laboratory: 'another-product-laboratory'
      }
      const expectedProduct: Product = {
        ...dto
      }
      beforeEach(async () => {
        givenThereIsExistingProducts(dolodent, hemoclar)
        await whenCreateProduct(dto)
      })
      it('should save the product in product gateway', async () => {
        await expectProductGatewayToEqual(dolodent, hemoclar, expectedProduct)
      })
      it('should save the product in product store', async () => {
        await expectProductStoreToEqual(dolodent, hemoclar, expectedProduct)
      })
    })
  })

  const givenThereIsExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
    productStore.items = products
  }

  const whenCreateProduct = async (dto: CreateProductDTO) => {
    await createProduct(dto, productGateway)
  }
  const expectProductStoreToEqual = (...products: Array<Product>) => {
    expect(productStore.items).toStrictEqual(products)
  }
  const expectProductGatewayToEqual = async (...products: Array<Product>) => {
    expect(await productGateway.list()).toStrictEqual(products)
  }
})
