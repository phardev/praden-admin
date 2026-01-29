import type { CategoryGateway } from '@core/gateways/categoryGateway'
import type { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

export const disableCategory = async (
  uuid: UUID,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const updatedCategories = await categoryGateway.disable(uuid)
  const categoryStore = useCategoryStore()
  updatedCategories.forEach((cat) => categoryStore.edit(cat))
}
