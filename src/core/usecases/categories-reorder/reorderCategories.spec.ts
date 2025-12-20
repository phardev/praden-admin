import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category } from '@core/entities/category'
import { UUID } from '@core/types/types'
import { reorderCategories } from '@core/usecases/categories-reorder/reorderCategories'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Categories reorder', () => {
  let categoryGateway: InMemoryCategoryGateway
  let categoryStore: any
  let expectedCategories: Array<Category>

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
    categoryStore = useCategoryStore()
    givenExistingCategories(dents, mum, baby)
  })

  describe('For a reorder', () => {
    it('should reorder categories in store', async () => {
      expectedCategories = [
        {
          ...mum,
          order: 0
        },
        {
          ...dents,
          order: 1
        },
        {
          ...baby,
          order: 2
        }
      ]
      await whenReorderCategories([mum.uuid, dents.uuid, baby.uuid])
      expect(categoryStore.items).toStrictEqual(expectedCategories)
    })
  })

  describe('For another reorder', () => {
    it('should reorder categories in store', async () => {
      expectedCategories = [
        {
          ...baby,
          order: 0
        },
        {
          ...mum,
          order: 1
        },
        {
          ...dents,
          order: 2
        }
      ]
      await whenReorderCategories([baby.uuid, mum.uuid, dents.uuid])
      expect(categoryStore.items).toStrictEqual(expectedCategories)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...categories)
    categoryStore.items = categories
  }

  const whenReorderCategories = async (categories: Array<UUID>) => {
    await reorderCategories(categories, categoryGateway)
  }
})
