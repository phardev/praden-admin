import { UUID } from '@core/types/types'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { useCategoryStore } from '@store/categoryStore'

export const getCategory = async (
  uuid: UUID,
  categoryGateway: CategoryGateway
) => {
  const category = await categoryGateway.getByUuid(uuid)
  const categoryStore = useCategoryStore()
  categoryStore.setCurrent(category)
}
