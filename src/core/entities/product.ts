import { HashTable, UUID } from '../types/types'

export type Stock = HashTable<number>

export interface Product {
  name: string
  img: string
  categoryUuid: UUID
  cip13: string
  priceWithoutTax: number
  percentTaxRate: number
  location: string
  availableStock: number
}
