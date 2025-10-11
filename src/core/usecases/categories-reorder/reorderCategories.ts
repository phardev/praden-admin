import { CategoryGateway } from '@core/gateways/categoryGateway'
import { useCategoryStore } from '@store/categoryStore'
import { UUID } from '@core/types/types'

export const reorderCategories = async (
  categories: Array<UUID>,
  categoryGateway: CategoryGateway
) => {
  const reordered = await categoryGateway.reorder(categories)
  const categoryStore = useCategoryStore()
  categoryStore.list(reordered)
}
