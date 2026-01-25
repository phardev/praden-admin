import type { CategoryStatus } from '@core/entities/category'
import type { CategoryGateway } from '@core/gateways/categoryGateway'
import type { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const toggleCategoryStatus = async (
  uuid: UUID,
  status: CategoryStatus,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const result = await categoryGateway.toggleStatus(uuid, status)
    categoryStore.edit(result.category)
    for (const cascaded of result.cascadedCategories) {
      categoryStore.edit(cascaded)
    }
  } finally {
    categoryStore.stopLoading()
  }
}
