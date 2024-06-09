import { UUID } from '@core/types/types'

export class CustomerDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Customer does not exists error: ${uuid}`)
  }
}
