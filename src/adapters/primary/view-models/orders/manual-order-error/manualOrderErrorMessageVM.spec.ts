import { priceFormatter } from '@utils/formatters'
import {
  type ErrorMessageVM,
  manualOrderErrorMessageVM
} from './manualOrderErrorMessageVM'

const httpError = (data: Record<string, unknown>) => ({ response: { data } })
const euros = (cents: number) =>
  priceFormatter('fr-FR', 'EUR').format(cents / 100)

describe('Manual order error message VM', () => {
  it('should explain that the customer already ordered the cart', () => {
    expect(
      manualOrderErrorMessageVM(httpError({ code: 'CART_CLOSED' }))
    ).toStrictEqual<ErrorMessageVM>({
      key: 'orders.create.errors.cartClosed',
      params: {}
    })
  })

  it('should explain that the cart belongs to another customer', () => {
    expect(
      manualOrderErrorMessageVM(httpError({ code: 'CART_NOT_OF_CUSTOMER' }))
    ).toStrictEqual<ErrorMessageVM>({
      key: 'orders.create.errors.cartNotOfCustomer',
      params: {}
    })
  })

  it('should explain that the cart no longer exists', () => {
    expect(
      manualOrderErrorMessageVM(httpError({ code: 'CART_NOT_FOUND' }))
    ).toStrictEqual<ErrorMessageVM>({
      key: 'orders.create.errors.cartNotFound',
      params: {}
    })
  })

  it('should explain why the promotion code is refused', () => {
    expect(
      manualOrderErrorMessageVM(
        httpError({
          code: 'PROMOTION_CODE_CANNOT_BE_APPLIED',
          reason: 'MINIMUM_AMOUNT_NOT_REACHED',
          minimumAmount: 3000,
          missingAmount: 1200
        })
      )
    ).toStrictEqual<ErrorMessageVM>({
      key: 'customers.cart.promotionCodeRejections.MINIMUM_AMOUNT_NOT_REACHED',
      params: { minimumAmount: euros(3000), missingAmount: euros(1200) }
    })
  })

  it('should keep the voucher messages for the other errors', () => {
    expect(
      manualOrderErrorMessageVM(httpError({ code: 'VOUCHER_ALREADY_USED' }))
    ).toStrictEqual<ErrorMessageVM>({
      key: 'voucher.errors.alreadyUsed',
      params: {}
    })
  })
})
