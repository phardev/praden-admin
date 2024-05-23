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
        cip7: '1234567',
        cip13: '1234567890123',
        ean13: '1234567890123',
        images: [new File(['data1'], 'File 1', { type: 'image/png' })],
        categoryUuid: 'category-uuid',
        priceWithoutTax: '1',
        percentTaxRate: '10',
        location: 'product-location',
        availableStock: '12',
        laboratory: 'product-laboratory',
        description: '<p>description</p>',
        instructionsForUse: '<p>instructions For Use</p>',
        composition: '<p>composition</p>'
      }
      const expectedProduct: Product = {
        name: dto.name,
        cip7: dto.cip7,
        cip13: dto.cip13,
        ean13: dto.ean13,
        miniature: '',
        images: ['data:image/png;base64,ZGF0YTE='],
        categoryUuid: dto.categoryUuid,
        priceWithoutTax: 100,
        percentTaxRate: 10,
        location: dto.location,
        availableStock: 12,
        laboratory: dto.laboratory,
        description: dto.description,
        instructionsForUse: dto.instructionsForUse,
        composition: dto.composition
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
        cip7: '0987654',
        cip13: '0987654321098',
        ean13: '0987654321098',
        images: [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ],
        categoryUuid: 'another-category-uuid',
        priceWithoutTax: '12.5',
        percentTaxRate: '10.5',
        location: 'another-product-location',
        availableStock: '21',
        laboratory: 'another-product-laboratory',
        description: '<p>another description</p>',
        instructionsForUse: '<p>another instructions For Use</p>',
        composition: '<p>another composition</p>'
      }
      const expectedProduct: Product = {
        name: dto.name,
        cip7: dto.cip7,
        cip13: dto.cip13,
        ean13: dto.ean13,
        miniature: '',
        images: [
          'data:image/png;base64,ZGF0YTE=',
          'data:image/jpeg;base64,ZGF0YTI=',
          'data:image/gif;base64,ZGF0YTM='
        ],
        categoryUuid: dto.categoryUuid,
        priceWithoutTax: 1250,
        percentTaxRate: 10.5,
        location: dto.location,
        availableStock: 21,
        laboratory: dto.laboratory,
        description: dto.description,
        instructionsForUse: dto.instructionsForUse,
        composition: dto.composition
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
