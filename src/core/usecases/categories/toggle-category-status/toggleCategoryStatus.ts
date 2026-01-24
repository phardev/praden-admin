import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const toggleCategoryStatus = async (
  uuid: UUID,
  cascade: boolean,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const updatedCategories = await categoryGateway.toggleStatus(uuid, cascade)
    categoryStore.editMultiple(updatedCategories)
  } finally {
    categoryStore.stopLoading()
  }
}
