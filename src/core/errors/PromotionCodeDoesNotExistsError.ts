export class PromotionCodeDoesNotExistsError extends Error {
  constructor(code: string) {
    super(`Promotion code does not exists error: ${code}`)
  }
}
