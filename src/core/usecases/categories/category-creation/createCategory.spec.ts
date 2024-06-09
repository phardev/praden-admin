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

describe('Create category', () => {
  let categoryStore
  const uuidGenerator: FakeUuidGenerator = new FakeUuidGenerator()
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(uuidGenerator)
  })
  describe('Root category', () => {
    const uuid = 'new-uuid'
    const categoryDTO: CreateCategoryDTO = {
      name: 'Created',
      description: 'The description'
    }
    const expectedCategory: Category = {
      ...categoryDTO,
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
      description: 'The child description'
    }
    describe('The parent category exists', () => {
      const dto = JSON.parse(JSON.stringify(categoryDTO))
      dto.parentUuid = dents.uuid
      const expectedCategory: Category = {
        ...dto,
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

  const whenCreateCategory = async (uuid: UUID, dto: CreateCategoryDTO) => {
    uuidGenerator.setNext(uuid)
    await createCategory(dto, categoryGateway)
  }
  const expectStoreToContains = (...categories: Array<Category>) => {
    expect(categoryStore.items).toStrictEqual(categories)
  }

  const expectGatewayToContains = async (...categories: Array<Category>) => {
    expect(await categoryGateway.list()).toStrictEqual(categories)
  }
})
