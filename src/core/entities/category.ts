import type { UUID } from '@core/types/types'

export interface Category {
  uuid: UUID
  name: string
  description: string
  parentUuid?: UUID
  miniature: string
  img: string
}

export interface CategoryWithProducts {
  category: Category
  products: Array<UUID>
}

export const isCategory = (object: any): object is Category => {
  return 'uuid' in object && 'name' in object
}
