import { UUID } from '@core/types/types'

export class LaboratoryDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Laboratory does not exists error: ${uuid}`)
  }
}
