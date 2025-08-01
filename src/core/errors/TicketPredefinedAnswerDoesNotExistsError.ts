import { UUID } from '@core/types/types'

export class TicketPredefinedAnswerDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`TicketPredefinedAnswer does not exists error: ${uuid}`)
  }
}
