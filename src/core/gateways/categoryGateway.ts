import { Category } from '@core/entities/category'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'

export interface CategoryGateway {
  list(): Promise<Array<Category>>
  create(dto: CreateCategoryDTO): Promise<Category>
}
