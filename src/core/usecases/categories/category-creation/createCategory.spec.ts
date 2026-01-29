import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category } from '@core/entities/category'
import { Product } from '@core/entities/product'
import { ParentCategoryDoesNotExistsError } from '@core/errors/ParentCategoryDoesNotExistsError'
import { UUID } from '@core/types/types'
import {
  CreateCategoryDTO,
  createCategory
} from '@core/usecases/categories/category-creation/createCategory'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { useCategoryStore } from '@store/categoryStore'
import { useProductStore } from '@store/productStore'
import { dents } from '@utils/testData/categories'
import {
  calmosineListItem,
  dolodentListItem
} from '@utils/testData/fixtures/products/productListItems'
import { calmosine, dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Create category', () => {
  let categoryStore: any
  const uuidGenerator: FakeUuidGenerator = new FakeUuidGenerator()
  let categoryGateway: InMemoryCategoryGateway
  let productStore: any
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(uuidGenerator)
    productStore = useProductStore()
    productGateway = new InMemoryProductGateway(uuidGenerator)
  })
  describe('Root category', () => {
    const uuid = 'new-uuid'
    const categoryDTO: CreateCategoryDTO = {
      name: 'Created',
      description: 'The description',
      productsAdded: []
    }
    const expectedCategory: Category = {
      name: 'Created',
      description: 'The description',
      uuid,
      order: 0,
      status: 'ACTIVE'
    }
    beforeEach(async () => {
      await whenCreateCategory(uuid, categoryDTO)
    })
    it('should save the category in the store', () => {
      expectStoreToContains(expectedCategory)
    })
    it('should save the category in the gateway', async () => {
      await expectGatewayToContains(expectedCategory)
    })
  })
  describe('Child category', () => {
    const uuid = 'new-uuid'
    const categoryDTO: CreateCategoryDTO = {
      name: 'Child category',
      description: 'The child description',
      productsAdded: []
    }
    describe('The parent category exists', () => {
      const dto = JSON.parse(JSON.stringify(categoryDTO))
      dto.parentUuid = dents.uuid
      const expectedCategory: Category = {
        name: 'Child category',
        description: 'The child description',
        uuid,
        order: 1,
        status: 'ACTIVE'
      }
      beforeEach(async () => {
        categoryGateway.feedWith(dents)
        await whenCreateCategory(uuid, dto)
      })
      it('should save the category in the store', () => {
        expectStoreToContains(expectedCategory)
      })
      it('should save the category in the gateway', async () => {
        await expectGatewayToContains(dents, expectedCategory)
      })
    })
    describe('The parent category does not exists', () => {
      const dto = JSON.parse(JSON.stringify(categoryDTO))
      dto.parentUuid = 'notExists'
      it('should throw an error', async () => {
        await expect(whenCreateCategory(uuid, dto)).rejects.toThrow(
          ParentCategoryDoesNotExistsError
        )
      })
    })
  })
  describe('Added products', () => {
    let expectedProducts: Array<Product> = []
    beforeEach(async () => {
      givenExistingProducts(dolodent, calmosine)
      givenExistingCategories(...dolodent.categories, ...calmosine.categories)
      const uuid = 'new-category-uuid'
      const dto: CreateCategoryDTO = {
        name: 'new-category',
        description: 'The description',
        productsAdded: [dolodent.uuid, calmosine.uuid]
      }
      const expectedCategory: Category = {
        name: 'new-category',
        description: 'The description',
        uuid,
        order: 0
      }
      await whenCreateCategory(uuid, dto)
      expectedProducts = [
        {
          ...dolodent,
          categories: [...dolodent.categories, expectedCategory]
        },
        {
          ...calmosine,
          categories: [...calmosine.categories, expectedCategory]
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
  describe('Loading', () => {
    beforeEach(() => {
      givenExistingCategories(dents)
    })
    it('should be aware during loading', async () => {
      const dto: CreateCategoryDTO = {
        name: 'new-category',
        description: 'The description',
        productsAdded: [dolodent.uuid, calmosine.uuid]
      }
      const unsubscribe = categoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenCreateCategory(dents.uuid, dto)
    })
    it('should be aware that loading is over', async () => {
      const dto: CreateCategoryDTO = {
        name: 'new-category',
        description: 'The description',
        productsAdded: [dolodent.uuid, calmosine.uuid]
      }
      await whenCreateCategory(dents.uuid, dto)
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...JSON.parse(JSON.stringify(products)))
    const productToListItemMap: Record<string, ProductListItem> = {
      [dolodent.uuid]: dolodentListItem,
      [calmosine.uuid]: calmosineListItem
    }
    productStore.items = products.map((p) => productToListItemMap[p.uuid])
  }

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }

  const whenCreateCategory = async (uuid: UUID, dto: CreateCategoryDTO) => {
    uuidGenerator.setNext(uuid)
    await createCategory(dto, categoryGateway, productGateway)
  }
  const expectStoreToContains = (...categories: Array<Category>) => {
    expect(categoryStore.items).toStrictEqual(categories)
  }

  const expectGatewayToContains = async (...categories: Array<Category>) => {
    expect(await categoryGateway.list()).toStrictEqual(categories)
  }

  const expectProductGatewayToContains = async (
    expected: Array<ProductListItem>
  ) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
