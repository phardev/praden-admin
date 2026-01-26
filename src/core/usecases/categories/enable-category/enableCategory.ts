import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const enableCategory = async (
  uuid: UUID,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const enabledCategories = await categoryGateway.enable(uuid)
    categoryStore.updateCategories(enabledCategories)
  } finally {
    categoryStore.stopLoading()
  }
}
