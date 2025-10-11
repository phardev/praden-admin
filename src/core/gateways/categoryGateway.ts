import { Category } from '@core/entities/category'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'
import { UUID } from '@core/types/types'

export interface CategoryGateway {
  list(): Promise<Array<Category>>
  create(dto: CreateCategoryDTO): Promise<Category>
  edit(uuid: UUID, dto: EditCategoryDTO): Promise<Category>
  getByUuid(uuid: UUID): Promise<Category>
  reorder(categoryUuids: Array<UUID>): Promise<Array<Category>>
}
