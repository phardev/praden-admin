import type { HashTable, UUID } from '@core/types/types'

export type Stock = HashTable<number>

export interface Product {
  uuid: UUID
  name: string
  miniature: string
  images: Array<string>
  categoryUuid: UUID
  cip7: string
  cip13: string
  ean13: string
  priceWithoutTax: number
  percentTaxRate: number
  locations: object
  availableStock: number
  laboratory: string
  description: string
  instructionsForUse: string
  composition: string
}

export const isProduct = (object: any): object is Product => {
  return 'cip13' in object
}
