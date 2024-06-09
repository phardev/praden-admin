import { UUID } from '@core/types/types'

export class ProductDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Product does not exists error: ${uuid}`)
  }
}
