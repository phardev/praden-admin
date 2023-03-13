import { Category } from '@core/entities/category'

export interface CategoryGateway {
  list(): Promise<Array<Category>>
}
