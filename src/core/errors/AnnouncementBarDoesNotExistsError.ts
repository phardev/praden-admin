import { UUID } from '@core/types/types'

export class AnnouncementBarDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`AnnouncementBar does not exists error: ${uuid}`)
  }
}
