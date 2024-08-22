import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '@store/productStore'
import {
  createProduct,
  CreateProductDTO
} from '@core/usecases/product/product-creation/createProduct'
import { Product } from '@core/entities/product'
import { dolodent, hemoclar } from '@utils/testData/products'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { reserve, zoneGeo } from '@utils/testData/locations'
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'
import { useCategoryStore } from '@store/categoryStore'
import { useLocationStore } from '@store/locationStore'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { diarrhee, mum } from '@utils/testData/categories'
import { Category } from '@core/entities/category'
import { Location } from '@core/entities/location'
import { LocationDoesNotExistsError } from '@core/errors/LocationDoesNotExistsError'

describe('Create product', () => {
  let productStore: any
  let categoryStore: any
  let locationStore: any
  let productGateway: InMemoryProductGateway
  let categoryGateway: InMemoryCategoryGateway
  let locationGateway: InMemoryLocationGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    categoryStore = useCategoryStore()
    locationStore = useLocationStore()
    productGateway = new InMemoryProductGateway(uuidGenerator)
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
    locationGateway = new InMemoryLocationGateway()
    givenThereIsExistingCategories(mum, diarrhee)
    givenThereIsExistingLocations(zoneGeo, reserve)
  })
  describe('Simple product', () => {
    describe('For a product', () => {
      const uuid = 'new-uuid'
      const dto: CreateProductDTO = {
        name: 'Created product',
        cip7: '1234567',
        cip13: '1234567890123',
        ean13: '1234567890123',
        images: [],
        newImages: [new File(['data1'], 'File 1', { type: 'image/png' })],
        categoryUuid: mum.uuid,
        priceWithoutTax: 100,
        percentTaxRate: 10,
        locations: { [zoneGeo.uuid]: 'product-location' },
        availableStock: 12,
        laboratory: 'product-laboratory',
        description: '<p>description</p>',
        instructionsForUse: '<p>instructions For Use</p>',
        composition: '<p>composition</p>',
        weight: 342
      }
      const expectedProduct: Product = {
        uuid,
        name: dto.name,
        cip7: dto.cip7,
        cip13: dto.cip13,
        ean13: dto.ean13,
        miniature: '',
        images: ['data:image/png;base64,ZGF0YTE='],
        categoryUuid: dto.categoryUuid,
        priceWithoutTax: 100,
        percentTaxRate: 10,
        locations: dto.locations,
        availableStock: 12,
        laboratory: dto.laboratory,
        description: dto.description,
        instructionsForUse: dto.instructionsForUse,
        composition: dto.composition,
        weight: dto.weight
      }
      beforeEach(async () => {
        uuidGenerator.setNext(uuid)
        await whenCreateProduct(dto)
      })
      it('should save the product in product gateway', async () => {
        await expectProductGatewayToEqual(expectedProduct)
      })
      it('should save the product in product store', () => {
        expectProductStoreToEqual(expectedProduct)
      })
    })
    describe('For another product', () => {
      const uuid = 'another-uuid'
      const dto: CreateProductDTO = {
        name: 'Another created product',
        cip7: '0987654',
        cip13: '0987654321098',
        ean13: '0987654321098',
        images: [],
        newImages: [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ],
        categoryUuid: diarrhee.uuid,
        priceWithoutTax: 125,
        percentTaxRate: 10.5,
        locations: {
          [zoneGeo.uuid]: 'another-product-location',
          [reserve.uuid]: 'RESERVE'
        },
        availableStock: 21,
        laboratory: 'another-product-laboratory',
        description: '<p>another description</p>',
        instructionsForUse: '<p>another instructions For Use</p>',
        composition: '<p>another composition</p>',
        weight: 60,
        maxQuantityForOrder: 12
      }
      const expectedProduct: Product = {
        uuid,
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
        priceWithoutTax: 125,
        percentTaxRate: 10.5,
        locations: dto.locations,
        availableStock: 21,
        laboratory: dto.laboratory,
        description: dto.description,
        instructionsForUse: dto.instructionsForUse,
        composition: dto.composition,
        weight: dto.weight,
        maxQuantityForOrder: dto.maxQuantityForOrder
      }
      beforeEach(async () => {
        givenThereIsExistingProducts(dolodent, hemoclar)
        uuidGenerator.setNext(uuid)
        await whenCreateProduct(dto)
      })
      it('should save the product in product gateway', async () => {
        await expectProductGatewayToEqual(dolodent, hemoclar, expectedProduct)
      })
      it('should save the product in product store', () => {
        expectProductStoreToEqual(dolodent, hemoclar, expectedProduct)
      })
    })
    describe('For a product without category', () => {
      const uuid = 'another-uuid'
      const dto: CreateProductDTO = {
        name: 'Another created product',
        cip7: '0987654',
        cip13: '0987654321098',
        ean13: '0987654321098',
        images: [],
        newImages: [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ],
        categoryUuid: undefined,
        priceWithoutTax: 125,
        percentTaxRate: 10.5,
        locations: {
          [zoneGeo.uuid]: 'another-product-location',
          [reserve.uuid]: 'RESERVE'
        },
        availableStock: 21,
        laboratory: 'another-product-laboratory',
        description: '<p>another description</p>',
        instructionsForUse: '<p>another instructions For Use</p>',
        composition: '<p>another composition</p>',
        weight: 60,
        maxQuantityForOrder: 12
      }
      const expectedProduct: Product = {
        uuid,
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
        priceWithoutTax: 125,
        percentTaxRate: 10.5,
        locations: dto.locations,
        availableStock: 21,
        laboratory: dto.laboratory,
        description: dto.description,
        instructionsForUse: dto.instructionsForUse,
        composition: dto.composition,
        weight: dto.weight,
        maxQuantityForOrder: dto.maxQuantityForOrder
      }
      beforeEach(async () => {
        givenThereIsExistingProducts(dolodent, hemoclar)
        uuidGenerator.setNext(uuid)
        await whenCreateProduct(dto)
      })
      it('should save the product in product gateway', async () => {
        await expectProductGatewayToEqual(dolodent, hemoclar, expectedProduct)
      })
      it('should save the product in product store', () => {
        expectProductStoreToEqual(dolodent, hemoclar, expectedProduct)
      })
    })
  })

  describe('Errors', () => {
    describe('The category does not exists', () => {
      const uuid = 'new-uuid'
      const dto: CreateProductDTO = {
        name: 'Created product',
        cip7: '1234567',
        cip13: '1234567890123',
        ean13: '1234567890123',
        images: [],
        newImages: [new File(['data1'], 'File 1', { type: 'image/png' })],
        categoryUuid: 'not-existing-category',
        priceWithoutTax: 100,
        percentTaxRate: 10,
        locations: { [zoneGeo.uuid]: 'product-location' },
        availableStock: 12,
        laboratory: 'product-laboratory',
        description: '<p>description</p>',
        instructionsForUse: '<p>instructions For Use</p>',
        composition: '<p>composition</p>',
        weight: 500
      }
      it('should throw an error', async () => {
        uuidGenerator.setNext(uuid)
        await expect(whenCreateProduct(dto)).rejects.toThrow(
          CategoryDoesNotExistsError
        )
      })
    })
    describe('The location does not exists', () => {
      const uuid = 'new-uuid'
      const dto: CreateProductDTO = {
        name: 'Created product',
        cip7: '1234567',
        cip13: '1234567890123',
        ean13: '1234567890123',
        images: [],
        newImages: [new File(['data1'], 'File 1', { type: 'image/png' })],
        categoryUuid: mum.uuid,
        priceWithoutTax: 100,
        percentTaxRate: 10,
        locations: {
          [zoneGeo.uuid]: 'product-location',
          ['not-exists']: 'value'
        },
        availableStock: 12,
        laboratory: 'product-laboratory',
        description: '<p>description</p>',
        instructionsForUse: '<p>instructions For Use</p>',
        composition: '<p>composition</p>',
        weight: 1000
      }
      it('should throw an error', async () => {
        uuidGenerator.setNext(uuid)
        await expect(whenCreateProduct(dto)).rejects.toThrow(
          LocationDoesNotExistsError
        )
      })
    })
  })

  const givenThereIsExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
    productStore.items = products
  }

  const givenThereIsExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...categories)
    categoryStore.items = categories
  }

  const givenThereIsExistingLocations = (...locations: Array<Location>) => {
    locationGateway.feedWith(...locations)
    locationStore.items = locations
  }

  const whenCreateProduct = async (dto: CreateProductDTO) => {
    await createProduct(dto, productGateway, categoryGateway, locationGateway)
  }
  const expectProductStoreToEqual = (...products: Array<Product>) => {
    expect(productStore.items).toStrictEqual(products)
  }
  const expectProductGatewayToEqual = async (...products: Array<Product>) => {
    expect(await productGateway.list()).toStrictEqual(products)
  }
})
