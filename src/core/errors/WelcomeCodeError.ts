export const WelcomeCodeErrorCode = {
  NotFound: 'WELCOME_CODE_NOT_FOUND',
  Invalid: 'WELCOME_CODE_INVALID',
  CodeTakenByWelcomeCode: 'CODE_TAKEN_BY_WELCOME_CODE',
  CodeTakenByPromotionCode: 'CODE_TAKEN_BY_PROMOTION_CODE'
} as const

export type WelcomeCodeErrorCode =
  (typeof WelcomeCodeErrorCode)[keyof typeof WelcomeCodeErrorCode]

export class WelcomeCodeError extends Error {
  readonly code: WelcomeCodeErrorCode

  constructor(code: WelcomeCodeErrorCode, identifier: string) {
    super(`Welcome code error ${code}: ${identifier}`)
    this.name = 'WelcomeCodeError'
    this.code = code
  }
}
