import { useCategoryStore } from '@store/categoryStore'
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { createPinia, setActivePinia } from 'pinia'
import { Category } from '@core/entities/category'
import { baby, dents, diarrhee, minceur } from '@utils/testData/categories'
import {
  editCategory,
  EditCategoryDTO
} from '@core/usecases/categories/category-edition/editCategory'
import { UUID } from '@core/types/types'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { ParentCategoryDoesNotExistsError } from '@core/errors/ParentCategoryDoesNotExistsError'
import { anaca3Minceur, calmosine, dolodent } from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { useProductStore } from '@store/productStore'

describe('Category Edition', () => {
  let categoryStore
  let categoryGateway: InMemoryCategoryGateway
  let productStore
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
        minceur,
        diarrhee,
        baby
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
        minceur,
        expectedCategory,
        baby
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
          whenEditCategory(dents.uuid, { parentUuid: 'not-exists' })
        ).rejects.toThrow(ParentCategoryDoesNotExistsError)
      })
    })
    describe('Added products', () => {
      let expectedProducts: Array<Product> = []
      beforeEach(async () => {
        givenExistingProducts(dolodent, calmosine)
        const dto: EditCategoryDTO = {
          productsAdded: [dolodent.uuid, calmosine.uuid]
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
        await expectProductGatewayToContains(expectedProducts)
      })
      it('should update the product store', () => {
        expect(productStore.items).toStrictEqual(expectedProducts)
      })
    })
    describe('Removed products', () => {
      let expectedProducts: Array<Product> = []
      beforeEach(async () => {
        givenExistingProducts(anaca3Minceur)
        const dto: EditCategoryDTO = {
          productsRemoved: [anaca3Minceur.uuid]
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
        await expectProductGatewayToContains(expectedProducts)
      })
      it('should update the product store', () => {
        expect(productStore.items).toStrictEqual(expectedProducts)
      })
    })
  })
  describe('The category does not exists', () => {
    it('should throw an error', async () => {
      await expect(
        whenEditCategory('NotExists', { name: 'NewName' })
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
    productStore.items = JSON.parse(JSON.stringify(products))
  }

  const whenEditCategory = async (
    uuid: UUID,
    dto: EditCategoryDTO
  ): Promise<void> => {
    await editCategory(uuid, dto, categoryGateway, productGateway)
  }

  const expectProductGatewayToContains = async (expected: Array<Product>) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
