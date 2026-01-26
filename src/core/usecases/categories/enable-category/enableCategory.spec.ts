import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Category } from '@core/entities/category'
import { enableCategory } from '@core/usecases/categories/enable-category/enableCategory'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Enable category', () => {
  let categoryStore: ReturnType<typeof useCategoryStore>
  let categoryGateway: InMemoryCategoryGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    categoryGateway = new InMemoryCategoryGateway(new FakeUuidGenerator())
  })

  describe('Enable single category', () => {
    const disabledDents: Category = {
      ...dents,
      status: 'INACTIVE'
    }

    beforeEach(async () => {
      givenExistingCategories(disabledDents, mum, baby)
      await whenEnableCategory(disabledDents.uuid)
    })

    it('should enable the category in the store', () => {
      const category = categoryStore.getByUuid(disabledDents.uuid)
      expect(category?.status).toBe('ACTIVE')
    })
  })

  describe('Enable parent category with cascade', () => {
    const disabledMum: Category = {
      ...mum,
      status: 'INACTIVE'
    }
    const disabledBaby: Category = {
      ...baby,
      status: 'INACTIVE'
    }

    beforeEach(async () => {
      givenExistingCategories(dents, disabledMum, disabledBaby)
      await whenEnableCategory(disabledMum.uuid)
    })

    it('should enable the parent category in the store', () => {
      const category = categoryStore.getByUuid(disabledMum.uuid)
      expect(category?.status).toBe('ACTIVE')
    })

    it('should cascade enable to child category in the store', () => {
      const category = categoryStore.getByUuid(disabledBaby.uuid)
      expect(category?.status).toBe('ACTIVE')
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      givenExistingCategories(dents)
    })

    it('should be aware during loading', async () => {
      const unsubscribe = categoryStore.$subscribe(
        (_mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenEnableCategory(dents.uuid)
    })

    it('should be aware that loading is over', async () => {
      await whenEnableCategory(dents.uuid)
      expect(categoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryGateway.feedWith(...JSON.parse(JSON.stringify(categories)))
    categoryStore.items = JSON.parse(JSON.stringify(categories))
  }

  const whenEnableCategory = async (uuid: string): Promise<void> => {
    await enableCategory(uuid, categoryGateway)
  }
})
