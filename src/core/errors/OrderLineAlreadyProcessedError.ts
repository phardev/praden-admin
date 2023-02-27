export class OrderLineAlreadyProcessedError extends Error {
  constructor() {
    super('Error: Order line already processed')
  }
}
