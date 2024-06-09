import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { useCategoryStore } from '@store/categoryStore'

export type EditCategoryDTO = Partial<CreateCategoryDTO>

export const editCategory = async (
  uuid: UUID,
  dto: EditCategoryDTO,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const edited = await categoryGateway.edit(uuid, dto)
  const categoryStore = useCategoryStore()
  categoryStore.edit(edited)
  return Promise.resolve()
}
