import {
  type CartErrorMessageVM,
  cartErrorMessageVM
} from './cartErrorMessageVM'

const httpError = (data: Record<string, unknown>) => ({ response: { data } })

describe('Cart error message VM', () => {
  it('should explain that the customer no longer has a cart', () => {
    expect(
      cartErrorMessageVM(httpError({ code: 'CART_NOT_FOUND' }))
    ).toStrictEqual<CartErrorMessageVM>({
      key: 'customers.cart.errors.notFound',
      params: {},
      cartOutdated: true
    })
  })

  it('should explain that the cart of the customer is empty', () => {
    expect(
      cartErrorMessageVM(httpError({ code: 'CART_EMPTY' }))
    ).toStrictEqual<CartErrorMessageVM>({
      key: 'customers.cart.errors.empty',
      params: {},
      cartOutdated: true
    })
  })

  it('should explain that the cart has already been ordered', () => {
    expect(
      cartErrorMessageVM(httpError({ code: 'CART_CLOSED' }))
    ).toStrictEqual<CartErrorMessageVM>({
      key: 'customers.cart.errors.closed',
      params: {},
      cartOutdated: true
    })
  })

  it('should keep the generic message for the other errors', () => {
    expect(
      cartErrorMessageVM(new Error('Network Error'))
    ).toStrictEqual<CartErrorMessageVM>({
      key: 'customers.cart.error',
      params: {},
      cartOutdated: false
    })
  })
})
