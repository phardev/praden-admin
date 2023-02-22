import { UUID } from '@core/types/types'

export class PreparationDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Error: Preparation ${uuid} does not exists`)
  }
}
