import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { createPinia, setActivePinia } from 'pinia'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  createCategory,
  CreateCategoryDTO
} from '@core/usecases/categories/category-creation/createCategory'
import { Category } from '@core/entities/category'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'
import { dents } from '@utils/testData/categories'
import { ParentCategoryDoesNotExistsError } from '@core/errors/ParentCategoryDoesNotExistsError'
import { Product } from '@core/entities/product'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { calmosine, dolodent } from '@utils/testData/products'
import { useProductStore } from '@store/productStore'

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
      uuid
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
        uuid
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
      const uuid = 'new-category-uuid'
      const dto: CreateCategoryDTO = {
        name: 'new-category',
        description: 'The description',
        productsAdded: [dolodent.uuid, calmosine.uuid]
      }
      const expectedCategory: Category = {
        name: 'new-category',
        description: 'The description',
        uuid
      }
      await whenCreateCategory(uuid, dto)
      expectedProducts = [
        {
          ...dolodent,
          category: expectedCategory
        },
        {
          ...calmosine,
          category: expectedCategory
        }
      ]
    })
    it('should add the added products to the category', async () => {
      await expectProductGatewayToContains(expectedProducts)
      expect(await productGateway.list(50, 0)).toStrictEqual(expectedProducts)
    })
    it('should update the product store', () => {
      expect(productStore.items).toStrictEqual(expectedProducts)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...JSON.parse(JSON.stringify(products)))
    productStore.items = JSON.parse(JSON.stringify(products))
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

  const expectProductGatewayToContains = async (expected: Array<Product>) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
