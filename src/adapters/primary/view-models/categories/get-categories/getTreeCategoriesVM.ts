import { useCategoryStore } from '@store/categoryStore'
import { UUID } from '@core/types/types'

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

const getChildren = (uuid: UUID): TreeCategoriesVM => {
  const categoryStore = useCategoryStore()
  const categories = categoryStore.items.filter((c) => c.parentUuid === uuid)
  return categories.map((c) => {
    return {
      data: {
        uuid: c.uuid,
        name: c.name,
        miniature: c.miniature
      },
      children: getChildren(c.uuid)
    }
  })
}

export const getTreeCategoriesVM = (): TreeCategoriesVM => {
  const categoryStore = useCategoryStore()
  const rootCategories = categoryStore.items.filter((c) => !c.parentUuid)
  return rootCategories.map((c) => {
    return {
      data: {
        uuid: c.uuid,
        name: c.name,
        miniature: c.miniature
      },
      children: getChildren(c.uuid)
    }
  })
}
