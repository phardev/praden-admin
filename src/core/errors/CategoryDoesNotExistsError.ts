import { UUID } from '@core/types/types'

export class CategoryDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Category does not exists error: ${uuid}`)
  }
}
