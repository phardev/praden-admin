export class PromotionNeedsProductError extends Error {
  constructor() {
    super('You need at least one product to create a promotion')
  }
}

export class PromotionReductionCannotExceed100Error extends Error {
  constructor(percentage: number) {
    super(`Reduction cannot exceed 100%. Actual: ${percentage}`)
  }
}
