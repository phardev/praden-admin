import { UUID } from '../types/types'

export interface Product {
  name: string
  img: string
  categoryUuid: UUID
  cip13: string
  priceWithoutTax: number
  percentTaxRate: number
  availableStock: number
}
