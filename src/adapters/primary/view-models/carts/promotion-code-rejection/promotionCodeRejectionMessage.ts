import type { CartCodeRejection } from '@core/entities/cart'
import { priceFormatter } from '@utils/formatters'

export interface ErrorMessageVM {
  key: string
  params: Record<string, string>
}

const GRAMS_PER_KILOGRAM = 1000

const euros = (cents: number): string =>
  priceFormatter('fr-FR', 'EUR').format(cents / 100)

export const promotionCodeRejectionMessage = (
  rejection?: Partial<CartCodeRejection>
): ErrorMessageVM => ({
  key: `customers.cart.promotionCodeRejections.${rejection?.reason ?? 'UNKNOWN'}`,
  params: {
    ...(rejection?.minimumAmount !== undefined && {
      minimumAmount: euros(rejection.minimumAmount)
    }),
    ...(rejection?.missingAmount !== undefined && {
      missingAmount: euros(rejection.missingAmount)
    }),
    ...(rejection?.maxWeight !== undefined && {
      maxWeight: `${rejection.maxWeight / GRAMS_PER_KILOGRAM}`
    })
  }
})
