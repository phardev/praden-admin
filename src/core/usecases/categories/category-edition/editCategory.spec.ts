import { useCategoryStore } from '@store/categoryStore'
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { createPinia, setActivePinia } from 'pinia'
import { Category } from '@core/entities/category'
import { dents, diarrhee, minceur } from '@utils/testData/categories'
import {
  editCategory,
  EditCategoryDTO
} from '@core/usecases/categories/category-edition/editCategory'
import { UUID } from '@core/types/types'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { ParentCategoryDoesNotExistsError } from '@core/errors/ParentCategoryDoesNotExistsError'

describe('Category Edition', () => {
  let categoryStore
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })
  describe('The category exists', () => {
    beforeEach(() => {
      givenExistingCategories(dents, minceur, diarrhee)
    })
    describe('For a category', () => {
      const dto: EditCategoryDTO = {
        description: 'The new description'
      }
      const expectedCategory: Category = {
        ...dents,
        ...dto
      }
      const expectedRes: Array<Category> = [expectedCategory, minceur, diarrhee]
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
        name: 'New name',
        parentUuid: minceur.uuid
      }
      const expectedCategory: Category = {
        ...diarrhee,
        ...dto
      }
      const expectedRes: Array<Category> = [dents, minceur, expectedCategory]
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
  })
  describe('The category does not exists', () => {
    it('should throw an error', async () => {
      await expect(
        whenEditCategory('NotExists', { name: 'NewName' })
      ).rejects.toThrow(CategoryDoesNotExistsError)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }

  const whenEditCategory = async (
    uuid: UUID,
    dto: EditCategoryDTO
  ): Promise<void> => {
    await editCategory(uuid, dto, categoryGateway)
  }
})
