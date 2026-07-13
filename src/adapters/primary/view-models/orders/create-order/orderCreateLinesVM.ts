import type { Product } from '@core/entities/product'
import type { Timestamp, UUID } from '@core/types/types'
import { priceFormatter } from '@utils/formatters'
import { addTaxToPrice } from '@utils/price'
import type { OrderCreateFormLine } from './orderCreateFormState'
import {
  promotionalUnitPriceWithTax,
  selectApplicablePromotion
} from './productPromotionPricing'

export interface OrderCreateLineVM {
  productUuid: string
  name: string
  ean13: string
  miniature: string
  quantity: number
  availableStock: number
  maxQuantityForOrder?: number
  formattedUnitPrice: string
  formattedLineTotal: string
  hasPromotion: boolean
  maxQuantityError: boolean
  unavailable: boolean
}

export interface MaxQuantityViolation {
  productUuid: UUID
  requestedQuantity: number
  maxQuantityForOrder: number
}

export const getUnitPriceWithTax = (product: Product): number => {
  return Math.round(
    addTaxToPrice(product.priceWithoutTax, product.percentTaxRate)
  )
}

export const orderCreateLinesVM = (
  lines: Array<OrderCreateFormLine>,
  now: Timestamp,
  violations: Array<MaxQuantityViolation> = []
): Array<OrderCreateLineVM> => {
  const formatter = priceFormatter('fr-FR', 'EUR')
  return lines.map(({ product, quantity, promotions }) => {
    const promotion = selectApplicablePromotion(promotions, now)
    const unitPriceWithTax = promotionalUnitPriceWithTax(product, promotion)
    const violation = violations.find(
      ({ productUuid }) => productUuid === product.uuid
    )
    const maxQuantityForOrder =
      violation?.maxQuantityForOrder ?? product.maxQuantityForOrder
    return {
      productUuid: product.uuid,
      name: product.name,
      ean13: product.ean13,
      miniature: product.miniature,
      quantity,
      availableStock: product.availableStock,
      maxQuantityForOrder,
      formattedUnitPrice: formatter.format(unitPriceWithTax / 100),
      formattedLineTotal: formatter.format((unitPriceWithTax * quantity) / 100),
      hasPromotion: promotion !== undefined,
      maxQuantityError:
        maxQuantityForOrder !== undefined && quantity > maxQuantityForOrder,
      unavailable: quantity > product.availableStock
    }
  })
}
