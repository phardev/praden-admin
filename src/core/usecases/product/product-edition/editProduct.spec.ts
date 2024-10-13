import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { useProductStore } from '@store/productStore'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import { Product } from '@core/entities/product'
import {
  editProduct,
  EditProductDTO
} from '@core/usecases/product/product-edition/editProduct'
import { UUID } from '@core/types/types'
import { createPinia, setActivePinia } from 'pinia'
import { baby, mum } from '@utils/testData/categories'
import { Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { reserve, zoneGeo } from '@utils/testData/locations'
import { Location } from '@core/entities/location'
import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'
import { useLocationStore } from '@store/locationStore'
import { LocationDoesNotExistsError } from '@core/errors/LocationDoesNotExistsError'

describe('Product edition', () => {
  let productStore: any
  let categoryStore: any
  let locationStore: any
  let productGateway: InMemoryProductGateway
  let locationGateway: InMemoryLocationGateway
  let product: Product
  let dto: EditProductDTO
  let expectedProduct: Product
  let expectedProducts: Array<Product>

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    categoryStore = useCategoryStore()
    locationStore = useLocationStore()
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    locationGateway = new InMemoryLocationGateway()
  })

  describe('The product exists', () => {
    beforeEach(() => {
      givenExistingProducts(chamomilla, ultraLevure, dolodent)
    })
    describe('Simple change', () => {
      beforeEach(async () => {
        givenEditingProductIs(dolodent)
        dto = {
          name: 'The new name'
        }
        expectedProduct = {
          ...product,
          name: dto.name
        }
        expectedProducts = [chamomilla, ultraLevure, expectedProduct]
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        await expectProductGatewayToContains(expectedProducts)
      })
      it('should edit the product in the store', async () => {
        expect(productStore.items).toStrictEqual(expectedProducts)
      })
    })
    describe('Price change', () => {
      beforeEach(async () => {
        givenEditingProductIs(dolodent)
        dto = {
          priceWithoutTax: 55
        }
        expectedProduct = {
          ...product,
          priceWithoutTax: 55
        }
        expectedProducts = [chamomilla, ultraLevure, expectedProduct]
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        await expectProductGatewayToContains(expectedProducts)
      })
      it('should edit the product in the store', async () => {
        expect(productStore.items).toStrictEqual(expectedProducts)
      })
    })

    describe('Tax change', () => {
      beforeEach(async () => {
        givenEditingProductIs(dolodent)
        dto = {
          percentTaxRate: 10.5
        }
        expectedProduct = {
          ...product,
          percentTaxRate: 10.5
        }
        expectedProducts = [chamomilla, ultraLevure, expectedProduct]
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        await expectProductGatewayToContains(expectedProducts)
      })
      it('should edit the product in the store', async () => {
        expect(productStore.items).toStrictEqual(expectedProducts)
      })
    })
    describe('Change category', () => {
      const product = JSON.parse(JSON.stringify(chamomilla))
      describe('The category exists', () => {
        beforeEach(() => {
          givenExistingCategories(mum, baby)
        })
        it('should change the category', async () => {
          dto = {
            categoryUuid: mum.uuid
          }
          expectedProduct = {
            ...product,
            category: mum
          }
          await whenEditProduct(product.uuid, dto)
          expect(productStore.items).toStrictEqual([
            expectedProduct,
            ultraLevure,
            dolodent
          ])
        })
      })
    })
    describe('Change location', () => {
      beforeEach(() => {
        givenExistingLocations(zoneGeo, reserve)
      })
      const product = JSON.parse(JSON.stringify(ultraLevure))
      describe('The location exists', () => {
        it('should change the location', async () => {
          dto = {
            locations: { [zoneGeo.uuid]: 'new-zoneGeo' }
          }
          expectedProduct = {
            ...product,
            locations: {
              ...ultraLevure.locations,
              ...dto.locations
            }
          }
          await whenEditProduct(product.uuid, dto)
          expect(productStore.items).toStrictEqual([
            chamomilla,
            expectedProduct,
            dolodent
          ])
        })
      })
      describe('The location does not exists', () => {
        it('should throw an error', async () => {
          dto = {
            locations: { ['not-existing']: 'value' }
          }

          await expect(whenEditProduct(product.uuid, dto)).rejects.toThrow(
            LocationDoesNotExistsError
          )
        })
        it('should check all locations', async () => {
          dto = {
            locations: {
              [zoneGeo.uuid]: 'new-zoneGeo',
              ['not-existing']: 'value'
            }
          }

          await expect(whenEditProduct(product.uuid, dto)).rejects.toThrow(
            LocationDoesNotExistsError
          )
        })
      })
    })
    describe('Images change', () => {
      beforeEach(async () => {
        dto = {
          newImages: [
            new File(['data1'], 'File 1', { type: 'image/png' }),
            new File(['data2'], 'File 2', { type: 'image/jpeg' })
          ]
        }
        givenEditingProductIs(dolodent)
        expectedProduct = {
          ...product,
          images: [
            ...product.images,
            'data:image/png;base64,ZGF0YTE=',
            'data:image/jpeg;base64,ZGF0YTI='
          ]
        }
        expectedProducts = [chamomilla, ultraLevure, expectedProduct]
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        await expectProductGatewayToContains(expectedProducts)
      })
      it('should edit the product in the store', async () => {
        expect(productStore.items).toStrictEqual(expectedProducts)
      })
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.items = products
    productGateway.feedWith(...products)
  }

  const givenEditingProductIs = (editing: Product) => {
    product = JSON.parse(JSON.stringify(editing))
  }

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
  }

  const givenExistingLocations = (...locations: Array<Location>) => {
    locationStore.items = locations
    locationGateway.feedWith(...locations)
  }

  const whenEditProduct = async (uuid: UUID, dto: EditProductDTO) => {
    await editProduct(uuid, dto, productGateway, locationGateway)
  }

  const expectProductGatewayToContains = async (expected: Array<Product>) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
