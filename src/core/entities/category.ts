import { Product } from '@core/entities/product'
import type { UUID } from '@core/types/types'

export interface Category {
  uuid: UUID
  name: string
  description: string
  parentUuid?: UUID
  miniature?: string
  image?: string
  order: number
}

export interface CategoryWithProducts {
  category: Category
  products: Array<Product>
}

export const isCategory = (object: any): object is Category => {
  return 'uuid' in object && 'name' in object
}
