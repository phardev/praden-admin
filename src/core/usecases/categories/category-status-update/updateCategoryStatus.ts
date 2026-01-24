import type { CategoryStatus } from '@core/entities/category'
import type { CategoryGateway } from '@core/gateways/categoryGateway'
import type { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const updateCategoryStatus = async (
  uuid: UUID,
  status: CategoryStatus,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const updatedCategories = await categoryGateway.updateStatus(uuid, status)
    categoryStore.updateMany(updatedCategories)
  } finally {
    categoryStore.stopLoading()
  }
}
