import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import { baby, dents, minceur, mum } from '@utils/testData/categories'
import { Category } from '@core/entities/category'
import { createPinia, setActivePinia } from 'pinia'
import { useCategoryStore } from '@store/categoryStore'

describe('Get tree categories VM', () => {
  let categoryStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
  })
  describe('There is no categories', () => {
    it('should return an empty vm', () => {
      const expectedVM = []
      expect(getTreeCategoriesVM()).toStrictEqual(expectedVM)
    })
  })
  describe('There only root categories', () => {
    it('should return one root category vm', () => {
      givenExistingCategories(mum)
      const expectedVM = [
        {
          data: {
            uuid: mum.uuid,
            name: mum.name
          },
          children: []
        }
      ]
      expect(getTreeCategoriesVM()).toStrictEqual(expectedVM)
    })
    it('should return multiple root category vm', () => {
      givenExistingCategories(mum, dents, minceur)
      const expectedVM = [
        {
          data: {
            uuid: mum.uuid,
            name: mum.name
          },
          children: []
        },
        {
          data: {
            uuid: dents.uuid,
            name: dents.name
          },
          children: []
        },
        {
          data: {
            uuid: minceur.uuid,
            name: minceur.name
          },
          children: []
        }
      ]
      expect(getTreeCategoriesVM()).toStrictEqual(expectedVM)
    })
  })

  describe('There is child categories', () => {
    it('should fill the children part', () => {
      givenExistingCategories(mum, baby)
      const expectedVM = [
        {
          data: {
            uuid: mum.uuid,
            name: mum.name
          },
          children: [
            {
              data: {
                uuid: baby.uuid,
                name: baby.name
              },
              children: []
            }
          ]
        }
      ]
      expectVMToStrictEqual(expectedVM)
    })
  })
  describe('Complex categories', () => {
    it('should fill all the children and grand children', () => {
      const rootCategory1: Category = {
        uuid: 'root-category1',
        name: 'Root category 1',
        description: ''
      }
      const childCategory1: Category = {
        uuid: 'child-category1',
        name: 'Child category 1',
        description: '',
        parentUuid: rootCategory1.uuid
      }
      const childCategory2: Category = {
        uuid: 'child-category2',
        name: 'Child category 2',
        description: '',
        parentUuid: rootCategory1.uuid
      }
      const grandChildCategory1: Category = {
        uuid: 'grandChild-category1',
        name: 'Grand child category 1',
        description: '',
        parentUuid: childCategory1.uuid
      }
      const grandChildCategory2: Category = {
        uuid: 'grandChild-category2',
        name: 'Grand child category 2',
        description: '',
        parentUuid: childCategory2.uuid
      }
      const rootCategory2: Category = {
        uuid: 'root-category2',
        name: 'Root category 2',
        description: ''
      }
      givenExistingCategories(
        rootCategory1,
        rootCategory2,
        childCategory1,
        childCategory2,
        grandChildCategory1,
        grandChildCategory2
      )
      const expectedVM = [
        {
          data: {
            uuid: rootCategory1.uuid,
            name: rootCategory1.name
          },
          children: [
            {
              data: {
                uuid: childCategory1.uuid,
                name: childCategory1.name
              },
              children: [
                {
                  data: {
                    uuid: grandChildCategory1.uuid,
                    name: grandChildCategory1.name
                  },
                  children: []
                }
              ]
            },
            {
              data: {
                uuid: childCategory2.uuid,
                name: childCategory2.name
              },
              children: [
                {
                  data: {
                    uuid: grandChildCategory2.uuid,
                    name: grandChildCategory2.name
                  },
                  children: []
                }
              ]
            }
          ]
        },
        {
          data: {
            uuid: rootCategory2.uuid,
            name: rootCategory2.name
          },
          children: []
        }
      ]
      expectVMToStrictEqual(expectedVM)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
  }

  const expectVMToStrictEqual = (expectedVM: any) => {
    expect(getTreeCategoriesVM()).toStrictEqual(expectedVM)
  }
})
