import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const reorderCategories = async (
  categories: Array<UUID>,
  categoryGateway: CategoryGateway
) => {
  const reordered = await categoryGateway.reorder(categories)
  const categoryStore = useCategoryStore()
  categoryStore.list(reordered)
}
