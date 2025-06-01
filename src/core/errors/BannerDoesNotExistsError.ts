import { UUID } from '@core/types/types'

export class BannerDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Banner does not exists error: ${uuid}`)
  }
}
