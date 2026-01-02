import {
  getTreeCategoriesVM,
  TreeCategoriesVM
} from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import { Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, minceur, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'

describe('Get tree categories VM', () => {
  let categoryStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
  })
  describe('There is no categories', () => {
    it('should return an empty vm', () => {
      const expectedVM: TreeCategoriesVM = []
      expect(getTreeCategoriesVM().items).toStrictEqual(expectedVM)
    })
  })
  describe('There only root categories', () => {
    it('should return one root category vm', () => {
      givenExistingCategories(mum)
      const expectedVM: TreeCategoriesVM = [
        {
          data: {
            uuid: mum.uuid,
            name: mum.name,
            miniature: mum.miniature!
          },
          children: []
        }
      ]
      expect(getTreeCategoriesVM().items).toStrictEqual(expectedVM)
    })
    it('should return multiple root category vm', () => {
      givenExistingCategories(mum, dents, minceur)
      const expectedVM: TreeCategoriesVM = [
        {
          data: {
            uuid: mum.uuid,
            name: mum.name,
            miniature: mum.miniature!
          },
          children: []
        },
        {
          data: {
            uuid: dents.uuid,
            name: dents.name,
            miniature: dents.miniature!
          },
          children: []
        },
        {
          data: {
            uuid: minceur.uuid,
            name: minceur.name,
            miniature: minceur.miniature!
          },
          children: []
        }
      ]
      expect(getTreeCategoriesVM().items).toStrictEqual(expectedVM)
    })
  })

  describe('There is child categories', () => {
    it('should fill the children part', () => {
      givenExistingCategories(mum, baby)
      const expectedVM: TreeCategoriesVM = [
        {
          data: {
            uuid: mum.uuid,
            name: mum.name,
            miniature: mum.miniature!
          },
          children: [
            {
              data: {
                uuid: baby.uuid,
                name: baby.name,
                miniature: baby.miniature!
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
        description: '',
        miniature: 'root-miniature-1',
        image: 'root-img-1',
        order: 0
      }
      const childCategory1: Category = {
        uuid: 'child-category1',
        name: 'Child category 1',
        description: '',
        parentUuid: rootCategory1.uuid,
        miniature: 'child-miniature-1',
        image: 'child-img-1',
        order: 1
      }
      const childCategory2: Category = {
        uuid: 'child-category2',
        name: 'Child category 2',
        description: '',
        parentUuid: rootCategory1.uuid,
        miniature: 'child-miniature-2',
        image: 'child-img-2',
        order: 2
      }
      const grandChildCategory1: Category = {
        uuid: 'grandChild-category1',
        name: 'Grand child category 1',
        description: '',
        parentUuid: childCategory1.uuid,
        miniature: 'grandchild-miniature-1',
        image: 'grandchild-img-1',
        order: 3
      }
      const grandChildCategory2: Category = {
        uuid: 'grandChild-category2',
        name: 'Grand child category 2',
        description: '',
        parentUuid: childCategory2.uuid,
        miniature: 'grandchild-miniature-2',
        image: 'grandchild-img-2',
        order: 4
      }
      const rootCategory2: Category = {
        uuid: 'root-category2',
        name: 'Root category 2',
        description: '',
        miniature: 'root-miniature-2',
        image: 'root-img-2',
        order: 5
      }
      givenExistingCategories(
        rootCategory1,
        rootCategory2,
        childCategory1,
        childCategory2,
        grandChildCategory1,
        grandChildCategory2
      )
      const expectedVM: TreeCategoriesVM = [
        {
          data: {
            uuid: rootCategory1.uuid,
            name: rootCategory1.name,
            miniature: rootCategory1.miniature!
          },
          children: [
            {
              data: {
                uuid: childCategory1.uuid,
                name: childCategory1.name,
                miniature: childCategory1.miniature!
              },
              children: [
                {
                  data: {
                    uuid: grandChildCategory1.uuid,
                    name: grandChildCategory1.name,
                    miniature: grandChildCategory1.miniature!
                  },
                  children: []
                }
              ]
            },
            {
              data: {
                uuid: childCategory2.uuid,
                name: childCategory2.name,
                miniature: childCategory2.miniature!
              },
              children: [
                {
                  data: {
                    uuid: grandChildCategory2.uuid,
                    name: grandChildCategory2.name,
                    miniature: grandChildCategory2.miniature!
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
            name: rootCategory2.name,
            miniature: rootCategory2.miniature!
          },
          children: []
        }
      ]
      expectVMToStrictEqual(expectedVM)
    })
  })

  describe('Loading', () => {
    it('should be aware if its loading', () => {
      categoryStore.isLoading = true
      expect(getTreeCategoriesVM().isLoading).toBe(true)
    })
    it('should be aware if its not loading', () => {
      categoryStore.isLoading = false
      expect(getTreeCategoriesVM().isLoading).toBe(false)
    })
  })

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
  }

  const expectVMToStrictEqual = (expectedVM: any) => {
    expect(getTreeCategoriesVM().items).toStrictEqual(expectedVM)
  }
})
