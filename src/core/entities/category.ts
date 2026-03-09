import { Product } from '@core/entities/product'
import type { UUID } from '@core/types/types'

export const CategoryStatus = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE'
} as const
export type CategoryStatus =
  (typeof CategoryStatus)[keyof typeof CategoryStatus]

export interface Category {
  uuid: UUID
  name: string
  description: string
  parentUuid?: UUID
  miniature?: string
  image?: string
  order: number
  status: CategoryStatus
}

export interface CategoryWithProducts {
  category: Category
  products: Array<Product>
}

export const isCategory = (object: any): object is Category => {
  return (
    'uuid' in object &&
    'name' in object &&
    'status' in object &&
    (object.status === CategoryStatus.Active ||
      object.status === CategoryStatus.Inactive)
  )
}
