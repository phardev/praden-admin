import { Product } from '@core/entities/product'
import { Promotion } from '@core/entities/promotion'

export type PharmacistSelection = Pick<
  Product,
  | 'uuid'
  | 'name'
  | 'priceWithoutTax'
  | 'percentTaxRate'
  | 'miniature'
  | 'maxQuantityForOrder'
  | 'availableStock'
  | 'weight'
  | 'flags'
> & {
  price: number
  laboratory?: string
  isMedicine: boolean
  promotions: Array<Promotion>
  order: number
}
