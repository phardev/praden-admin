import {
  getTreeCategoriesVM,
  TreeCategoriesVM
} from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
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
      const expectedVM: TreeCategoriesVM = []
      expect(getTreeCategoriesVM()).toStrictEqual(expectedVM)
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
            miniature: mum.miniature
          },
          children: []
        }
      ]
      expect(getTreeCategoriesVM()).toStrictEqual(expectedVM)
    })
    it('should return multiple root category vm', () => {
      givenExistingCategories(mum, dents, minceur)
      const expectedVM: TreeCategoriesVM = [
        {
          data: {
            uuid: mum.uuid,
            name: mum.name,
            miniature: mum.miniature
          },
          children: []
        },
        {
          data: {
            uuid: dents.uuid,
            name: dents.name,
            miniature: dents.miniature
          },
          children: []
        },
        {
          data: {
            uuid: minceur.uuid,
            name: minceur.name,
            miniature: minceur.miniature
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
      const expectedVM: TreeCategoriesVM = [
        {
          data: {
            uuid: mum.uuid,
            name: mum.name,
            miniature: mum.miniature
          },
          children: [
            {
              data: {
                uuid: baby.uuid,
                name: baby.name,
                miniature: baby.miniature
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
        img: 'root-img-1'
      }
      const childCategory1: Category = {
        uuid: 'child-category1',
        name: 'Child category 1',
        description: '',
        parentUuid: rootCategory1.uuid,
        miniature: 'child-miniature-1',
        img: 'child-img-1'
      }
      const childCategory2: Category = {
        uuid: 'child-category2',
        name: 'Child category 2',
        description: '',
        parentUuid: rootCategory1.uuid,
        miniature: 'child-miniature-2',
        img: 'child-img-2'
      }
      const grandChildCategory1: Category = {
        uuid: 'grandChild-category1',
        name: 'Grand child category 1',
        description: '',
        parentUuid: childCategory1.uuid,
        miniature: 'grandchild-miniature-1',
        img: 'grandchild-img-1'
      }
      const grandChildCategory2: Category = {
        uuid: 'grandChild-category2',
        name: 'Grand child category 2',
        description: '',
        parentUuid: childCategory2.uuid,
        miniature: 'grandchild-miniature-2',
        img: 'grandchild-img-2'
      }
      const rootCategory2: Category = {
        uuid: 'root-category2',
        name: 'Root category 2',
        description: '',
        miniature: 'root-miniature-2',
        img: 'root-img-2'
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
            miniature: rootCategory1.miniature
          },
          children: [
            {
              data: {
                uuid: childCategory1.uuid,
                name: childCategory1.name,
                miniature: childCategory1.miniature
              },
              children: [
                {
                  data: {
                    uuid: grandChildCategory1.uuid,
                    name: grandChildCategory1.name,
                    miniature: grandChildCategory1.miniature
                  },
                  children: []
                }
              ]
            },
            {
              data: {
                uuid: childCategory2.uuid,
                name: childCategory2.name,
                miniature: childCategory2.miniature
              },
              children: [
                {
                  data: {
                    uuid: grandChildCategory2.uuid,
                    name: grandChildCategory2.name,
                    miniature: grandChildCategory2.miniature
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
            miniature: rootCategory2.miniature
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
