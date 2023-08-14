import { UUID } from '@core/types/types'

export class PromotionDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Promotion does not exists error: ${uuid}`)
  }
}
