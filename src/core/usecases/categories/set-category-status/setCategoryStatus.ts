import type { CategoryStatus } from '@core/entities/category'
import type { CategoryGateway } from '@core/gateways/categoryGateway'
import type { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const setCategoryStatus = async (
  uuid: UUID,
  status: CategoryStatus,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const updated = await categoryGateway.setStatus(uuid, status)
    categoryStore.editMany(updated)
  } finally {
    categoryStore.stopLoading()
  }
}
