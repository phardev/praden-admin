import type { HashTable, UUID } from '@core/types/types'
import { Promotion } from './promotion'
import { Category } from '@core/entities/category'
import { Laboratory } from '@core/entities/laboratory'

export type Stock = HashTable<number>

export interface Product {
  uuid: UUID
  name: string
  miniature: string
  images: Array<string>
  categories: Array<Category>
  cip7: string
  cip13: string
  ean13: string
  priceWithoutTax: number
  percentTaxRate: number
  locations: object
  availableStock: number
  laboratory?: Laboratory | null
  description: string
  instructionsForUse: string
  composition: string
  weight: number
  maxQuantityForOrder?: number
  isMedicine: boolean
}

export interface ProductWithPromotion {
  product: Product
  promotion?: Promotion
}

export const isProduct = (object: any): object is Product => {
  return 'cip13' in object
}
