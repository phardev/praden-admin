export class CartDoesNotExistsError extends Error {
  constructor(uuid: string) {
    super(`Cart ${uuid} does not exist`)
    this.name = 'CartDoesNotExistsError'
  }
}
