import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'
import { UUID } from '@core/types/types'

export interface CreateTicketPredefinedAnswerDTO {
  title: string
  content: string
}

export interface UpdateTicketPredefinedAnswerDTO {
  title: string
  content: string
}

export interface TicketPredefinedAnswerGateway {
  list(): Promise<Array<TicketPredefinedAnswer>>
  getByUuid(uuid: UUID): Promise<TicketPredefinedAnswer>
  create(dto: CreateTicketPredefinedAnswerDTO): Promise<TicketPredefinedAnswer>
  update(
    uuid: UUID,
    dto: UpdateTicketPredefinedAnswerDTO
  ): Promise<TicketPredefinedAnswer>
  delete(uuid: UUID): Promise<void>
}
