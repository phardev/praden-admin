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
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { useCategoryStore } from '@store/categoryStore'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
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
  let categoryGateway: InMemoryCategoryGateway
  let locationGateway: InMemoryLocationGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    categoryStore = useCategoryStore()
    locationStore = useLocationStore()
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
    locationGateway = new InMemoryLocationGateway()
  })

  describe('The product exists', () => {
    beforeEach(() => {
      givenExistingProducts(chamomilla, ultraLevure, dolodent)
    })
    describe('Simple change', () => {
      const product = JSON.parse(JSON.stringify(dolodent))
      const dto: EditProductDTO = {
        name: 'The new name'
      }
      const expectedProduct: Product = {
        ...product,
        ...dto
      }
      const expectedProducts = [chamomilla, ultraLevure, expectedProduct]
      beforeEach(async () => {
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        expect(await productGateway.list()).toStrictEqual(expectedProducts)
      })
      it('should edit the product in the store', async () => {
        expect(productStore.items).toStrictEqual(expectedProducts)
      })
    })
    describe('Price change', () => {
      const product = JSON.parse(JSON.stringify(dolodent))
      const dto: EditProductDTO = {
        priceWithoutTax: '5.5'
      }
      const expectedProduct: Product = {
        ...product,
        priceWithoutTax: 550
      }
      const expectedProducts = [chamomilla, ultraLevure, expectedProduct]
      beforeEach(async () => {
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        expect(await productGateway.list()).toStrictEqual(expectedProducts)
      })
      // it('should edit the product in the store', async () => {
      //   expect(productStore.items).toStrictEqual(expectedProducts)
      // })
    })
    describe('Change category', () => {
      const product = JSON.parse(JSON.stringify(chamomilla))
      describe('The category exists', () => {
        beforeEach(() => {
          givenExistingCategories(mum, baby)
        })
        it('should change the category', async () => {
          const dto: EditProductDTO = {
            categoryUuid: mum.uuid
          }
          const expectedProduct = {
            ...product,
            ...dto
          }
          await whenEditProduct(product.uuid, dto)
          expect(productStore.items).toStrictEqual([
            expectedProduct,
            ultraLevure,
            dolodent
          ])
        })
      })
      describe('The category does not exists', () => {
        it('should throw an error', async () => {
          const dto: EditProductDTO = {
            categoryUuid: 'not-existing'
          }
          await expect(whenEditProduct(product.uuid, dto)).rejects.toThrow(
            CategoryDoesNotExistsError
          )
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
          const dto: EditProductDTO = {
            locations: { [zoneGeo.uuid]: 'new-zoneGeo' }
          }
          const expectedProduct = {
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
          const dto: EditProductDTO = {
            locations: { ['not-existing']: 'value' }
          }
          await expect(whenEditProduct(product.uuid, dto)).rejects.toThrow(
            LocationDoesNotExistsError
          )
        })
        it('should check all locations', async () => {
          const dto: EditProductDTO = {
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
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.items = products
    productGateway.feedWith(...products)
  }

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
    categoryGateway.feedWith(...categories)
  }

  const givenExistingLocations = (...locations: Array<Location>) => {
    locationStore.items = locations
    locationGateway.feedWith(...locations)
  }

  const whenEditProduct = async (uuid: UUID, dto: EditProductDTO) => {
    await editProduct(
      uuid,
      dto,
      productGateway,
      categoryGateway,
      locationGateway
    )
  }
})
