export class PromotionCodeWithSameCodeAlreadyExistsError extends Error {
  constructor(code: string) {
    super(`Promotion code with same code already exists error: ${code}`)
  }
}
