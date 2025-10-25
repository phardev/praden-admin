import { Category } from '@core/entities/category'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export interface TreeNode<T> {
  data: T
  children: Array<TreeNode<T>>
}

export interface TreeCategoryNodeVM {
  uuid: UUID
  name: string
  miniature: string
}

export type TreeCategoriesVM = Array<TreeNode<TreeCategoryNodeVM>>

export interface CategoriesVM {
  isLoading: boolean
  items: TreeCategoriesVM
}

const getChildren = (uuid: UUID): TreeCategoriesVM => {
  const categoryStore = useCategoryStore()
  const categories = categoryStore.items.filter((c) => c.parentUuid === uuid)
  return categories.map((c: Category) => {
    return {
      data: {
        uuid: c.uuid,
        name: c.name,
        miniature: c.miniature || ''
      },
      children: getChildren(c.uuid)
    }
  })
}

export const getTreeCategoriesVM = (): CategoriesVM => {
  const categoryStore = useCategoryStore()
  const rootCategories = categoryStore.items.filter((c) => !c.parentUuid)
  return {
    isLoading: categoryStore.isLoading,
    items: rootCategories.map((c) => {
      return {
        data: {
          uuid: c.uuid,
          name: c.name,
          miniature: c.miniature || ''
        },
        children: getChildren(c.uuid)
      }
    })
  }
}
