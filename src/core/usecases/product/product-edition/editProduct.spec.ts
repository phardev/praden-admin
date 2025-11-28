import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category } from '@core/entities/category'
import { Location } from '@core/entities/location'
import { Product } from '@core/entities/product'
import {
  createExistingImage,
  createNewImage
} from '@core/entities/productImage'
import { UUID } from '@core/types/types'
import {
  EditProductDTO,
  editProduct
} from '@core/usecases/product/product-edition/editProduct'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { useCategoryStore } from '@store/categoryStore'
import { useLocationStore } from '@store/locationStore'
import { useProductStore } from '@store/productStore'
import { baby, mum } from '@utils/testData/categories'
import {
  chamomillaListItem,
  dolodentListItem,
  ultraLevureListItem
} from '@utils/testData/fixtures/products/productListItems'
import { reserve, zoneGeo } from '@utils/testData/locations'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Product edition', () => {
  let productStore: any
  let categoryStore: any
  let locationStore: any
  let productGateway: InMemoryProductGateway
  let locationGateway: InMemoryLocationGateway
  let product: Product
  let dto: EditProductDTO
  let expectedProduct: Product

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
          flags: { arePromotionsAllowed: true },
          name: dto.name!
        }
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        expect(await productGateway.getByUuid(product.uuid)).toStrictEqual(
          expectedProduct
        )
      })
      it('should edit the product in the store', async () => {
        const expectedDolodent = { ...dolodentListItem, name: 'The new name' }
        expect(productStore.items).toStrictEqual([
          chamomillaListItem,
          ultraLevureListItem,
          expectedDolodent
        ])
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
          flags: { arePromotionsAllowed: true },
          priceWithoutTax: 55
        }
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        expect(await productGateway.getByUuid(product.uuid)).toStrictEqual(
          expectedProduct
        )
      })
      it('should edit the product in the store', async () => {
        const expectedDolodent = { ...dolodentListItem, priceWithoutTax: 55 }
        expect(productStore.items).toStrictEqual([
          chamomillaListItem,
          ultraLevureListItem,
          expectedDolodent
        ])
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
          flags: { arePromotionsAllowed: true },
          percentTaxRate: 10.5
        }
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        expect(await productGateway.getByUuid(product.uuid)).toStrictEqual(
          expectedProduct
        )
      })
      it('should edit the product in the store', async () => {
        const expectedDolodent = { ...dolodentListItem, percentTaxRate: 10.5 }
        expect(productStore.items).toStrictEqual([
          chamomillaListItem,
          ultraLevureListItem,
          expectedDolodent
        ])
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
            categoryUuids: [mum.uuid]
          }
          expectedProduct = {
            ...product,
            flags: { arePromotionsAllowed: true },
            categories: [mum]
          }
          await whenEditProduct(product.uuid, dto)
          const expectedChamomilla = {
            ...chamomillaListItem,
            categories: [{ uuid: mum.uuid, name: mum.name }]
          }
          expect(productStore.items).toStrictEqual([
            expectedChamomilla,
            ultraLevureListItem,
            dolodentListItem
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
            flags: { arePromotionsAllowed: true },
            locations: {
              ...ultraLevure.locations,
              ...dto.locations
            }
          }
          await whenEditProduct(product.uuid, dto)
          const expectedUltraLevure = {
            ...ultraLevureListItem
          }
          expect(productStore.items).toStrictEqual([
            chamomillaListItem,
            expectedUltraLevure,
            dolodentListItem
          ])
        })
      })
    })
    describe('Images change', () => {
      beforeEach(async () => {
        givenEditingProductIs(dolodent)
        const file1 = new File(['data1'], 'File 1', { type: 'image/png' })
        const file2 = new File(['data2'], 'File 2', { type: 'image/jpeg' })
        dto = {
          orderedImages: [
            createExistingImage(product.images[0], 'existing-0', 0),
            createNewImage(file1, 'new-1', 1, ''),
            createNewImage(file2, 'new-2', 2, '')
          ]
        }
        expectedProduct = {
          ...product,
          flags: { arePromotionsAllowed: true },
          images: [
            product.images[0],
            'data:image/png;base64,ZGF0YTE=',
            'data:image/jpeg;base64,ZGF0YTI='
          ]
        }
        await whenEditProduct(product.uuid, dto)
      })
      it('should edit the product in the gateway', async () => {
        await expectProductGatewayToContains(
          chamomillaListItem,
          ultraLevureListItem,
          dolodentListItem
        )
      })
      it('should edit the product in the gateway with updated images', async () => {
        expect(await productGateway.getByUuid(product.uuid)).toStrictEqual(
          expectedProduct
        )
      })
      it('should edit the product in the store', async () => {
        expect(productStore.items).toStrictEqual([
          chamomillaListItem,
          ultraLevureListItem,
          dolodentListItem
        ])
      })
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      givenExistingProducts(dolodent)
      givenEditingProductIs(dolodent)
      dto = {
        name: 'The new name'
      }
    })
    it('should be aware during loading', async () => {
      const unsubscribe = productStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenEditProduct(product.uuid, dto)
    })
    it('should be aware that loading is over', async () => {
      await whenEditProduct(product.uuid, dto)
      expect(productStore.isLoading).toBe(false)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    const productToListItemMap: Record<string, ProductListItem> = {
      [chamomilla.uuid]: chamomillaListItem,
      [dolodent.uuid]: dolodentListItem,
      [ultraLevure.uuid]: ultraLevureListItem
    }
    productStore.items = products.map((p) => productToListItemMap[p.uuid])
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
    await editProduct(uuid, dto, productGateway)
  }

  const expectProductGatewayToContains = async (
    ...expected: Array<ProductListItem>
  ) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
