import type {
  TreeCategoryNodeVM,
  TreeNode
} from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import type { CategoryStatus } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { useFormStore } from '@store/formStore'
import { baby, dents, mum } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'
import {
  type CategoryTree,
  categoryReorderFormVM
} from './categoryReorderFormVM'

const createTreeNode = (
  uuid: string,
  name: string,
  miniature: string,
  status: CategoryStatus,
  children: CategoryTree = []
): TreeNode<TreeCategoryNodeVM> => ({
  data: { uuid, name, miniature, status },
  children
})

describe('Category Reorder Form VM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Given empty category store', () => {
    it('should initialize with empty tree', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = []

      const vm = categoryReorderFormVM()

      expect(vm.tree).toStrictEqual([])
    })
  })

  describe('Given categories in store', () => {
    it('should initialize tree from store', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum, baby]

      const vm = categoryReorderFormVM()

      expect(vm.tree).toStrictEqual([
        createTreeNode(
          dents.uuid,
          dents.name,
          dents.miniature || '',
          dents.status
        ),
        createTreeNode(mum.uuid, mum.name, mum.miniature || '', mum.status, [
          createTreeNode(
            baby.uuid,
            baby.name,
            baby.miniature || '',
            baby.status
          )
        ])
      ])
    })

    it('should start with hasChanges false', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents]

      const vm = categoryReorderFormVM()

      expect(vm.hasChanges).toStrictEqual(false)
    })

    it('should reflect isLoading from store', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents]
      categoryStore.isLoading = true

      const vm = categoryReorderFormVM()

      expect(vm.isLoading).toStrictEqual(true)
    })
  })

  describe('Given tree update', () => {
    it('should update tree when updateTree is called', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum]

      const vm = categoryReorderFormVM()
      const newTree = [
        createTreeNode(mum.uuid, mum.name, mum.miniature || '', mum.status),
        createTreeNode(
          dents.uuid,
          dents.name,
          dents.miniature || '',
          dents.status
        )
      ]
      vm.updateTree(newTree)

      expect(vm.tree).toStrictEqual(newTree)
    })

    it('should set hasChanges to true after tree update', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum]

      const vm = categoryReorderFormVM()
      const newTree = [
        createTreeNode(mum.uuid, mum.name, mum.miniature || '', mum.status),
        createTreeNode(
          dents.uuid,
          dents.name,
          dents.miniature || '',
          dents.status
        )
      ]
      vm.updateTree(newTree)

      expect(vm.hasChanges).toStrictEqual(true)
    })

    it('should detect no changes when tree is same as original', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum]

      const vm = categoryReorderFormVM()
      const sameTree = [
        createTreeNode(
          dents.uuid,
          dents.name,
          dents.miniature || '',
          dents.status
        ),
        createTreeNode(mum.uuid, mum.name, mum.miniature || '', mum.status)
      ]
      vm.updateTree(sameTree)

      expect(vm.hasChanges).toStrictEqual(false)
    })
  })

  describe('Given reset', () => {
    it('should reset tree to original state from store', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum]

      const vm = categoryReorderFormVM()
      const newTree = [
        createTreeNode(mum.uuid, mum.name, mum.miniature || '', mum.status)
      ]
      vm.updateTree(newTree)
      vm.reset()

      expect(vm.tree).toStrictEqual([
        createTreeNode(
          dents.uuid,
          dents.name,
          dents.miniature || '',
          dents.status
        ),
        createTreeNode(mum.uuid, mum.name, mum.miniature || '', mum.status)
      ])
    })

    it('should set hasChanges to false after reset', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum]

      const vm = categoryReorderFormVM()
      const newTree = [
        createTreeNode(mum.uuid, mum.name, mum.miniature || '', mum.status)
      ]
      vm.updateTree(newTree)
      vm.reset()

      expect(vm.hasChanges).toStrictEqual(false)
    })
  })

  describe('Given flatten tree', () => {
    it('should flatten simple tree with no children', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, mum, baby]

      const vm = categoryReorderFormVM()

      expect(vm.getOrderedUuids()).toStrictEqual([
        dents.uuid,
        mum.uuid,
        baby.uuid
      ])
    })

    it('should flatten nested tree depth-first', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [dents, { ...mum, parentUuid: dents.uuid }, baby]

      const vm = categoryReorderFormVM()

      expect(vm.getOrderedUuids()).toStrictEqual([
        dents.uuid,
        mum.uuid,
        baby.uuid
      ])
    })

    it('should flatten multi-level tree correctly', () => {
      const categoryStore = useCategoryStore()
      categoryStore.items = [
        dents,
        { ...mum, parentUuid: dents.uuid },
        { ...baby, parentUuid: mum.uuid }
      ]

      const vm = categoryReorderFormVM()

      expect(vm.getOrderedUuids()).toStrictEqual([
        dents.uuid,
        mum.uuid,
        baby.uuid
      ])
    })
  })
})
