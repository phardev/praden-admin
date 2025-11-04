import type {
  TreeCategoryNodeVM,
  TreeNode
} from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import { useCategoryStore } from '@store/categoryStore'
import { useFormStore } from '@store/formStore'

export type CategoryTree = Array<TreeNode<TreeCategoryNodeVM>>

const FORM_KEY = 'category-reorder-form'

const flattenTree = (nodes: CategoryTree): Array<string> => {
  const result: Array<string> = []
  const traverse = (items: CategoryTree) => {
    items.forEach((item) => {
      result.push(item.data.uuid)
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    })
  }
  traverse(nodes)
  return result
}

export const categoryReorderFormVM = () => {
  const formStore = useFormStore()
  const categoryStore = useCategoryStore()

  const initialTree: CategoryTree = getTreeCategoriesVM().items

  formStore.set(FORM_KEY, { tree: initialTree })

  const getFormTree = (): CategoryTree => {
    return formStore.get(FORM_KEY)?.tree || []
  }

  const updateTree = (newTree: CategoryTree) => {
    formStore.set(FORM_KEY, { tree: newTree })
  }

  const getOrderedUuids = (): Array<string> => {
    return flattenTree(getFormTree())
  }

  const reset = () => {
    const resetTree: CategoryTree = getTreeCategoriesVM().items
    formStore.set(FORM_KEY, { tree: resetTree })
  }

  return {
    get tree() {
      return getFormTree()
    },
    get hasChanges() {
      const currentUuids = flattenTree(getFormTree())
      const originalUuids = flattenTree(getTreeCategoriesVM().items)
      return JSON.stringify(currentUuids) !== JSON.stringify(originalUuids)
    },
    get isLoading() {
      return categoryStore.isLoading
    },
    updateTree,
    getOrderedUuids,
    reset
  }
}
