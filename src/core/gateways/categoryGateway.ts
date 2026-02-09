import type { Category } from '@core/entities/category'
import type { UUID } from '@core/types/types'
import type { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import type { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'

export interface CategoryGateway {
  list(): Promise<Array<Category>>
  create(dto: CreateCategoryDTO): Promise<Category>
  edit(uuid: UUID, dto: EditCategoryDTO): Promise<Category>
  getByUuid(uuid: UUID): Promise<Category>
  reorder(categoryUuids: Array<UUID>): Promise<Array<Category>>
  enable(uuid: UUID): Promise<Array<Category>>
  disable(uuid: UUID): Promise<Array<Category>>
}
