import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const getCategory = async (
  uuid: UUID,
  categoryGateway: CategoryGateway
) => {
  const categoryStore = useCategoryStore()
  try {
    categoryStore.startLoading()
    const category = await categoryGateway.getByUuid(uuid)
    categoryStore.setCurrentCategory(category)
  } finally {
    categoryStore.stopLoading()
  }
}
