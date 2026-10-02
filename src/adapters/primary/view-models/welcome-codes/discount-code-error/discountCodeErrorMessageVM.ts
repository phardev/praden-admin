import { WelcomeCodeErrorCode } from '@core/errors/WelcomeCodeError'

const GENERIC_ERROR_KEY = 'error.unknown'

const keysByCode: Record<string, string> = {
  [WelcomeCodeErrorCode.CodeTakenByWelcomeCode]:
    'discountCode.errors.takenByWelcomeCode',
  [WelcomeCodeErrorCode.CodeTakenByPromotionCode]:
    'discountCode.errors.takenByPromotionCode',
  [WelcomeCodeErrorCode.Invalid]: 'welcomeCode.errors.invalid',
  [WelcomeCodeErrorCode.NotFound]: 'welcomeCode.errors.notFound'
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const errorCodeOf = (error: unknown): unknown => {
  if (!isObject(error)) return undefined
  const response = error.response
  if (isObject(response)) {
    return isObject(response.data) ? response.data.code : undefined
  }
  return error.code
}

export const discountCodeErrorMessageKey = (error: unknown): string =>
  keysByCode[String(errorCodeOf(error))] ?? GENERIC_ERROR_KEY
