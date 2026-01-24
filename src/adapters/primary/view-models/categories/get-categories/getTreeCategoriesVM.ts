import { Category, CategoryStatus } from '@core/entities/category'
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
  status: CategoryStatus
  hasChildren: boolean
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
    const children = getChildren(c.uuid)
    return {
      data: {
        uuid: c.uuid,
        name: c.name,
        miniature: c.miniature || '',
        status: c.status,
        hasChildren: children.length > 0
      },
      children
    }
  })
}

export const getTreeCategoriesVM = (): CategoriesVM => {
  const categoryStore = useCategoryStore()
  const rootCategories = categoryStore.items.filter((c) => !c.parentUuid)
  return {
    isLoading: categoryStore.isLoading,
    items: rootCategories.map((c) => {
      const children = getChildren(c.uuid)
      return {
        data: {
          uuid: c.uuid,
          name: c.name,
          miniature: c.miniature || '',
          status: c.status,
          hasChildren: children.length > 0
        },
        children
      }
    })
  }
}
