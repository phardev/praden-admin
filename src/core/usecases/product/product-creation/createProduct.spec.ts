import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '@store/productStore'
import {
  createProduct,
  CreateProductDTO
} from '@core/usecases/product/product-creation/createProduct'
import { Product, ProductStatus } from '@core/entities/product'
import { dolodent, hemoclar } from '@utils/testData/products'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { reserve, zoneGeo } from '@utils/testData/locations'
import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'
import { useCategoryStore } from '@store/categoryStore'
import { useLocationStore } from '@store/locationStore'
import { diarrhee, mum } from '@utils/testData/categories'
import { Category } from '@core/entities/category'
import { Location } from '@core/entities/location'
import { UUID } from '@core/types/types'
import { avene, gilbert } from '@utils/testData/laboratories'
import { InMemoryFailProductGateway } from '@core/usecases/product/product-creation/inMemoryFailProductGateway'

describe('Create product', () => {
  let productStore: any
  let categoryStore: any
  let locationStore: any
  let productGateway: InMemoryProductGateway
  let failProductGateway: InMemoryFailProductGateway
  let locationGateway: InMemoryLocationGateway
  const uuidGenerator = new FakeUuidGenerator()
  let uuid: UUID
  let dto: CreateProductDTO
  let expectedProduct: Product

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    categoryStore = useCategoryStore()
    locationStore = useLocationStore()
    productGateway = new InMemoryProductGateway(uuidGenerator)
    locationGateway = new InMemoryLocationGateway()
    givenThereIsExistingLocations(zoneGeo, reserve)
    givenThereIsExistingCategories(mum, diarrhee)
  })
  describe('Simple product', () => {
    describe('For a product', () => {
      beforeEach(async () => {
        uuid = 'new-uuid'
        uuidGenerator.setNext(uuid)
        dto = {
          name: 'Created product',
          status: ProductStatus.Active,
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          images: [new File(['data1'], 'File 1', { type: 'image/png' })],
          categoryUuids: [mum.uuid],
          priceWithoutTax: 100,
          percentTaxRate: 10,
          locations: { [zoneGeo.uuid]: 'product-location' },
          availableStock: 12,
          laboratory: avene,
          description: '<p>description</p>',
          instructionsForUse: '<p>instructions For Use</p>',
          composition: '<p>composition</p>',
          weight: 342,
          flags: { arePromotionsAllowed: true }
        }
        expectedProduct = {
          uuid,
          name: dto.name,
          status: dto.status,
          cip7: dto.cip7,
          cip13: dto.cip13,
          ean13: dto.ean13,
          categories: [mum],
          miniature: '',
          images: ['data:image/png;base64,ZGF0YTE='],
          priceWithoutTax: 100,
          percentTaxRate: 10,
          locations: dto.locations,
          availableStock: 12,
          laboratory: dto.laboratory,
          description: dto.description,
          instructionsForUse: dto.instructionsForUse,
          composition: dto.composition,
          weight: dto.weight,
          isMedicine: false,
          flags: { arePromotionsAllowed: true }
        }
        await whenCreateProduct(dto)
      })

      it('should create a product with flags', async () => {
        expect(productStore.items[0]).toStrictEqual(expectedProduct)
      })
      it('should save the product in product gateway', async () => {
        await expectProductGatewayToEqual(expectedProduct)
      })
      it('should save the product in product store', () => {
        expectProductStoreToEqual(expectedProduct)
      })
    })
    describe('For another product', () => {
      beforeEach(async () => {
        givenThereIsExistingProducts(dolodent, hemoclar)
        uuid = 'another-uuid'
        uuidGenerator.setNext(uuid)
        dto = {
          name: 'Another created product',
          status: ProductStatus.Inactive,
          cip7: '0987654',
          cip13: '0987654321098',
          ean13: '0987654321098',
          images: [
            new File(['data1'], 'File 1', { type: 'image/png' }),
            new File(['data2'], 'File 2', { type: 'image/jpeg' }),
            new File(['data3'], 'File 3', { type: 'image/gif' })
          ],
          categoryUuids: [diarrhee.uuid],
          priceWithoutTax: 125,
          percentTaxRate: 10.5,
          locations: {
            [zoneGeo.uuid]: 'another-product-location',
            [reserve.uuid]: 'RESERVE'
          },
          availableStock: 21,
          laboratory: gilbert,
          description: '<p>another description</p>',
          instructionsForUse: '<p>another instructions For Use</p>',
          composition: '<p>another composition</p>',
          weight: 60,
          maxQuantityForOrder: 12,

          flags: { arePromotionsAllowed: true }
        }
        expectedProduct = {
          uuid,
          status: dto.status,
          categories: [diarrhee],
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
          maxQuantityForOrder: dto.maxQuantityForOrder,
          isMedicine: false,

          flags: { arePromotionsAllowed: true }
        }
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
        status: ProductStatus.Active,
        cip7: '0987654',
        cip13: '0987654321098',
        ean13: '0987654321098',
        images: [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ],
        categoryUuids: [],
        priceWithoutTax: 125,
        percentTaxRate: 10.5,
        locations: {
          [zoneGeo.uuid]: 'another-product-location',
          [reserve.uuid]: 'RESERVE'
        },
        availableStock: 21,
        laboratory: gilbert,
        description: '<p>another description</p>',
        instructionsForUse: '<p>another instructions For Use</p>',
        composition: '<p>another composition</p>',
        weight: 60,
        maxQuantityForOrder: 12,

        flags: { arePromotionsAllowed: true }
      }
      const expectedProduct: Product = {
        uuid,
        status: dto.status,
        name: dto.name,
        categories: [],
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
        maxQuantityForOrder: dto.maxQuantityForOrder,
        isMedicine: false,

        flags: { arePromotionsAllowed: true }
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

  describe('Loading', () => {
    beforeEach(() => {
      uuid = 'new-uuid'
      uuidGenerator.setNext(uuid)
      dto = {
        name: 'Created product',
        status: ProductStatus.Active,
        cip7: '1234567',
        cip13: '1234567890123',
        ean13: '1234567890123',
        images: [new File(['data1'], 'File 1', { type: 'image/png' })],
        categoryUuids: [mum.uuid],
        priceWithoutTax: 100,
        percentTaxRate: 10,
        locations: { [zoneGeo.uuid]: 'product-location' },
        availableStock: 12,
        laboratory: avene,
        description: '<p>description</p>',
        instructionsForUse: '<p>instructions For Use</p>',
        composition: '<p>composition</p>',
        weight: 342,
        flags: { arePromotionsAllowed: true }
      }
    })
    it('should be aware during loading', async () => {
      const unsubscribe = productStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenCreateProduct(dto)
    })
    it('should be aware that loading is over', async () => {
      await whenCreateProduct(dto)
      expect(productStore.isLoading).toBe(false)
    })
  })

  describe('Error', () => {
    const errorMessage = 'failed to create product'
    beforeEach(async () => {
      failProductGateway = new InMemoryFailProductGateway()
      failProductGateway.feedErrorMessageWith(errorMessage)
      dto = {
        name: 'Created product',
        status: ProductStatus.Active,
        cip7: '1234567',
        cip13: '1234567890123',
        ean13: '1234567890123',
        images: [new File(['data1'], 'File 1', { type: 'image/png' })],
        categoryUuids: [mum.uuid],
        priceWithoutTax: 100,
        percentTaxRate: 10,
        locations: { [zoneGeo.uuid]: 'product-location' },
        availableStock: 12,
        laboratory: avene,
        description: '<p>description</p>',
        instructionsForUse: '<p>instructions For Use</p>',
        composition: '<p>composition</p>',
        weight: 342,
        flags: { arePromotionsAllowed: true }
      }
    })
    it('should not save the product in gateway', async () => {
      try {
        await whenFailCreateProduct(dto)
      } catch {
        /* For testing purpose */
      } finally {
        await expectProductGatewayToEqual()
      }
    })
    it('should not save the product in store', async () => {
      try {
        await whenFailCreateProduct(dto)
      } catch {
        /* For testing purpose */
      } finally {
        expectProductStoreToEqual()
      }
    })
    it('should be aware that loading is over', async () => {
      try {
        await whenFailCreateProduct(dto)
      } catch {
        /* For testing purpose */
      } finally {
        expect(productStore.isLoading).toBe(false)
      }
    })
  })

  const givenThereIsExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
    productStore.items = products
  }

  const givenThereIsExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
  }

  const givenThereIsExistingLocations = (...locations: Array<Location>) => {
    locationGateway.feedWith(...locations)
    locationStore.items = locations
  }

  const whenCreateProduct = async (dto: CreateProductDTO) => {
    await createProduct(dto, productGateway)
  }

  const whenFailCreateProduct = async (dto: CreateProductDTO) => {
    await createProduct(dto, failProductGateway)
  }

  const expectProductStoreToEqual = (...products: Array<Product>) => {
    expect(productStore.items).toStrictEqual(products)
  }
  const expectProductGatewayToEqual = async (...products: Array<Product>) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(products)
  }
})
