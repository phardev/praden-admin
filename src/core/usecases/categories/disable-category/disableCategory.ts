import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const disableCategory = async (
  uuid: UUID,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const disabledCategories = await categoryGateway.disable(uuid)
    categoryStore.updateCategories(disabledCategories)
  } finally {
    categoryStore.stopLoading()
  }
}
