import { UUID } from '@core/types/types'

export class TicketDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`Ticket does not exists error: ${uuid}`)
  }
}
