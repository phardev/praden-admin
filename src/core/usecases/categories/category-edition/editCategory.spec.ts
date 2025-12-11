import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category } from '@core/entities/category'
import { Product } from '@core/entities/product'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { ParentCategoryDoesNotExistsError } from '@core/errors/ParentCategoryDoesNotExistsError'
import { UUID } from '@core/types/types'
import {
  EditCategoryDTO,
  editCategory
} from '@core/usecases/categories/category-edition/editCategory'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { useCategoryStore } from '@store/categoryStore'
import { useProductStore } from '@store/productStore'
import { baby, dents, diarrhee, minceur } from '@utils/testData/categories'
import {
  anaca3MinceurListItem,
  calmosineListItem,
  dolodentListItem
} from '@utils/testData/fixtures/products/productListItems'
import { anaca3Minceur, calmosine, dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Category Edition', () => {
  let categoryStore: any
  let categoryGateway: InMemoryCategoryGateway
  let productStore: any
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
    productStore = useProductStore()
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
  })
  describe('The category exists', () => {
    beforeEach(() => {
      givenExistingCategories(dents, minceur, diarrhee, baby)
    })
    describe('For a category', () => {
      const dto: EditCategoryDTO = {
        ...dents,
        description: 'The new description',
        productsAdded: [],
        productsRemoved: []
      }
      const expectedCategory: Category = {
        ...dents,
        description: 'The new description'
      }
      const expectedRes: Array<Category> = [
        expectedCategory,
        baby,
        diarrhee,
        minceur
      ]
      beforeEach(async () => {
        await whenEditCategory(expectedCategory.uuid, dto)
      })
      it('should edit the category in the gateway', async () => {
        expect(await categoryGateway.list()).toStrictEqual(expectedRes)
      })
      it('should edit the category in the store', async () => {
        expect(categoryStore.items).toStrictEqual(expectedRes)
      })
    })
    describe('For another category', () => {
      const dto: EditCategoryDTO = {
        ...diarrhee,
        name: 'New name',
        parentUuid: minceur.uuid,
        productsAdded: [],
        productsRemoved: []
      }
      const expectedCategory: Category = {
        ...diarrhee,
        name: 'New name',
        parentUuid: minceur.uuid
      }
      const expectedRes: Array<Category> = [
        dents,
        baby,
        expectedCategory,
        minceur
      ]
      beforeEach(async () => {
        await whenEditCategory(diarrhee.uuid, dto)
      })
      it('should edit the category in the gateway', async () => {
        expect(await categoryGateway.list()).toStrictEqual(expectedRes)
      })
      it('should edit the category in the store', async () => {
        expect(categoryStore.items).toStrictEqual(expectedRes)
      })
    })
    describe('The parent category does not exists', () => {
      it('should throw an error', async () => {
        await expect(
          whenEditCategory(dents.uuid, {
            parentUuid: 'not-exists',
            name: dents.name,
            description: dents.description,
            productsAdded: [],
            productsRemoved: []
          })
        ).rejects.toThrow(ParentCategoryDoesNotExistsError)
      })
    })
    describe('Added products', () => {
      let expectedProducts: Array<Product> = []
      beforeEach(async () => {
        givenExistingProducts(dolodent, calmosine)
        const dto: EditCategoryDTO = {
          name: minceur.name,
          description: minceur.description,
          productsAdded: [dolodent.uuid, calmosine.uuid],
          productsRemoved: []
        }
        await whenEditCategory(minceur.uuid, dto)
        expectedProducts = [
          {
            ...dolodent,
            categories: [...dolodent.categories, minceur]
          },
          {
            ...calmosine,
            categories: [...calmosine.categories, minceur]
          }
        ]
      })
      it('should add the added products to the category', async () => {
        const expectedListItems = expectedProducts.map((product) => ({
          uuid: product.uuid,
          name: product.name,
          ean13: product.ean13,
          laboratory: product.laboratory
            ? {
                uuid: product.laboratory.uuid,
                name: product.laboratory.name
              }
            : undefined,
          categories: product.categories.map((c) => ({
            uuid: c.uuid,
            name: c.name
          })),
          priceWithoutTax: product.priceWithoutTax,
          percentTaxRate: product.percentTaxRate,
          availableStock: product.availableStock,
          minStockToSell: product.minStockToSell,
          stockManagementMode: product.stockManagementMode,
          status: product.status,
          flags: product.flags,
          miniature: product.miniature,
          isMedicine: product.isMedicine
        }))
        await expectProductGatewayToContains(expectedListItems)
      })
      it('should update the product store', () => {
        const expectedListItems = expectedProducts.map((product) => ({
          uuid: product.uuid,
          name: product.name,
          ean13: product.ean13,
          laboratory: product.laboratory
            ? {
                uuid: product.laboratory.uuid,
                name: product.laboratory.name
              }
            : undefined,
          categories: product.categories.map((c) => ({
            uuid: c.uuid,
            name: c.name
          })),
          priceWithoutTax: product.priceWithoutTax,
          percentTaxRate: product.percentTaxRate,
          availableStock: product.availableStock,
          minStockToSell: product.minStockToSell,
          stockManagementMode: product.stockManagementMode,
          status: product.status,
          flags: product.flags,
          miniature: product.miniature,
          isMedicine: product.isMedicine
        }))
        expect(productStore.items).toStrictEqual(expectedListItems)
      })
    })
    describe('Removed products', () => {
      let expectedProducts: Array<Product> = []
      beforeEach(async () => {
        givenExistingProducts(anaca3Minceur)
        const dto: EditCategoryDTO = {
          name: minceur.name,
          description: minceur.description,
          productsRemoved: [anaca3Minceur.uuid],
          productsAdded: []
        }
        await whenEditCategory(minceur.uuid, dto)
        expectedProducts = [
          {
            ...anaca3Minceur,
            categories: []
          }
        ]
      })
      it('should add the added products to the category', async () => {
        const expectedListItems = expectedProducts.map((product) => ({
          uuid: product.uuid,
          name: product.name,
          ean13: product.ean13,
          laboratory: product.laboratory
            ? {
                uuid: product.laboratory.uuid,
                name: product.laboratory.name
              }
            : undefined,
          categories: product.categories.map((c) => ({
            uuid: c.uuid,
            name: c.name
          })),
          priceWithoutTax: product.priceWithoutTax,
          percentTaxRate: product.percentTaxRate,
          availableStock: product.availableStock,
          minStockToSell: product.minStockToSell,
          stockManagementMode: product.stockManagementMode,
          status: product.status,
          flags: product.flags,
          miniature: product.miniature,
          isMedicine: product.isMedicine
        }))
        await expectProductGatewayToContains(expectedListItems)
      })
      it('should update the product store', () => {
        const expectedListItems = expectedProducts.map((product) => ({
          uuid: product.uuid,
          name: product.name,
          ean13: product.ean13,
          laboratory: product.laboratory
            ? {
                uuid: product.laboratory.uuid,
                name: product.laboratory.name
              }
            : undefined,
          categories: product.categories.map((c) => ({
            uuid: c.uuid,
            name: c.name
          })),
          priceWithoutTax: product.priceWithoutTax,
          percentTaxRate: product.percentTaxRate,
          availableStock: product.availableStock,
          minStockToSell: product.minStockToSell,
          stockManagementMode: product.stockManagementMode,
          status: product.status,
          flags: product.flags,
          miniature: product.miniature,
          isMedicine: product.isMedicine
        }))
        expect(productStore.items).toStrictEqual(expectedListItems)
      })
    })
  })
  describe('The category does not exists', () => {
    it('should throw an error', async () => {
      await expect(
        whenEditCategory('NotExists', {
          name: 'NewName',
          description: 'NewDescription',
          productsAdded: [],
          productsRemoved: []
        })
      ).rejects.toThrow(CategoryDoesNotExistsError)
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenExistingCategories(dents)
    })
    it('should be aware during loading', async () => {
      const dto: EditCategoryDTO = {
        ...dents,
        description: 'The new description',
        productsAdded: [],
        productsRemoved: []
      }
      const unsubscribe = categoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenEditCategory(dents.uuid, dto)
    })
    it('should be aware that loading is over', async () => {
      const dto: EditCategoryDTO = {
        ...dents,
        description: 'The new description',
        productsAdded: [],
        productsRemoved: []
      }
      await whenEditCategory(dents.uuid, dto)
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...JSON.parse(JSON.stringify(products)))
    const productToListItemMap: Record<string, ProductListItem> = {
      [dolodent.uuid]: dolodentListItem,
      [calmosine.uuid]: calmosineListItem,
      [anaca3Minceur.uuid]: anaca3MinceurListItem
    }
    productStore.items = products.map((p) => productToListItemMap[p.uuid])
  }

  const whenEditCategory = async (
    uuid: UUID,
    dto: EditCategoryDTO
  ): Promise<void> => {
    await editCategory(uuid, dto, categoryGateway, productGateway)
  }

  const expectProductGatewayToContains = async (
    expected: Array<ProductListItem>
  ) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
