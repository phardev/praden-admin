import {
  WelcomeCodeError,
  WelcomeCodeErrorCode
} from '@core/errors/WelcomeCodeError'
import { discountCodeErrorMessageKey } from './discountCodeErrorMessageVM'

describe('Discount code error message VM', () => {
  const backendError = (code: string) => ({ response: { data: { code } } })

  it('should explain that the code is taken by a welcome code', () => {
    expect(
      discountCodeErrorMessageKey(backendError('CODE_TAKEN_BY_WELCOME_CODE'))
    ).toBe('discountCode.errors.takenByWelcomeCode')
  })

  it('should explain that the code is taken by a promotion code', () => {
    expect(
      discountCodeErrorMessageKey(backendError('CODE_TAKEN_BY_PROMOTION_CODE'))
    ).toBe('discountCode.errors.takenByPromotionCode')
  })

  it('should explain that the welcome code is invalid', () => {
    expect(
      discountCodeErrorMessageKey(backendError('WELCOME_CODE_INVALID'))
    ).toBe('welcomeCode.errors.invalid')
  })

  it('should explain that the welcome code no longer exists', () => {
    expect(
      discountCodeErrorMessageKey(backendError('WELCOME_CODE_NOT_FOUND'))
    ).toBe('welcomeCode.errors.notFound')
  })

  it('should explain an error raised without the backend', () => {
    expect(
      discountCodeErrorMessageKey(
        new WelcomeCodeError(
          WelcomeCodeErrorCode.CodeTakenByPromotionCode,
          'HELLO'
        )
      )
    ).toBe('discountCode.errors.takenByPromotionCode')
  })

  it('should fall back to a generic message for an unknown error', () => {
    expect(discountCodeErrorMessageKey(new Error('boom'))).toBe('error.unknown')
  })

  it('should fall back to a generic message when there is no error detail', () => {
    expect(discountCodeErrorMessageKey(undefined)).toBe('error.unknown')
  })
})
