export class NoPreparationSelectedError extends Error {
  constructor() {
    super('There is no preparation selected')
  }
}
