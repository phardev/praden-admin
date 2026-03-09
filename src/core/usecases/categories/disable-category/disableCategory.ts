import type { CategoryGateway } from '@core/gateways/categoryGateway'
import type { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const disableCategory = async (
  uuid: UUID,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  categoryStore.startLoading()
  try {
    const updatedCategories = await categoryGateway.disable(uuid)
    categoryStore.updateMany(updatedCategories)
  } finally {
    categoryStore.stopLoading()
  }
}
