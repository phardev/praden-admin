import type { OrderCreateFormState } from './orderCreateFormState'

export const promotionCodeBasisOf = (
  formState: Pick<
    OrderCreateFormState,
    'lines' | 'deliveryMethod' | 'deliveryAddress'
  >
): string =>
  JSON.stringify({
    lines: formState.lines
      .map(({ product, quantity }) => [product.uuid, quantity])
      .sort(),
    deliveryMethodUuid: formState.deliveryMethod?.uuid,
    country: formState.deliveryAddress.country
  })

export const isPromotionCodeDiscountCurrent = (
  formState: OrderCreateFormState
): boolean =>
  formState.promotionCode !== undefined &&
  formState.promotionCode.basis === promotionCodeBasisOf(formState)
