import type { CategoryGateway } from '@core/gateways/categoryGateway'
import type { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const disableCategory = async (
  uuid: UUID,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const categories = await categoryGateway.disable(uuid)
    categoryStore.list(categories)
  } finally {
    categoryStore.stopLoading()
  }
}
