import { Category } from '@core/entities/category'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { useCategoryStore } from '@store/categoryStore'

export type CreateCategoryDTO = Omit<Category, 'uuid'>

export const createCategory = async (
  dto: CreateCategoryDTO,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const created = await categoryGateway.create(dto)
  const categoryStore = useCategoryStore()
  categoryStore.add(created)
}
