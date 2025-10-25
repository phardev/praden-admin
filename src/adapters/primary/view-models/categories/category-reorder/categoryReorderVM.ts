import { Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'

export interface CategoryForDisplay {
  uuid: string
  name: string
  order: number
  image?: string
  miniature?: string
}

export const categoryReorderVM = () => {
  const categoryStore = useCategoryStore()

  const loadFromStore = () => {
    return categoryStore.items
      .map(
        (c: Category): CategoryForDisplay => ({
          uuid: c.uuid,
          name: c.name,
          order: c.order,
          image: c.image,
          miniature: c.miniature
        })
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  let sortedCategories = loadFromStore()
  let hasChanges = false

  const reorder = (oldIndex: number, newIndex: number) => {
    const result = [...sortedCategories]
    const [movedItem] = result.splice(oldIndex, 1)
    result.splice(newIndex, 0, movedItem)
    sortedCategories = result
    hasChanges = true
  }

  const getCategoryUuids = (): Array<string> => {
    return sortedCategories.map((c) => c.uuid)
  }

  const reset = () => {
    sortedCategories = loadFromStore()
    hasChanges = false
  }

  return {
    get sortedCategories() {
      return sortedCategories
    },
    get hasChanges() {
      return hasChanges
    },
    isLoading: categoryStore.isLoading,
    reorder,
    getCategoryUuids,
    reset
  }
}
