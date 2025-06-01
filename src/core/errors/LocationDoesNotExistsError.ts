import { UUID } from '@core/types/types'

export class LocationDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Location does not exists error: ${uuid}`)
  }
}
