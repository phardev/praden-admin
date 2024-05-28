import { UUID } from '@core/types/types'

export class ParentCategoryDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Parent category "${uuid}" doesn't exists`)
  }
}
