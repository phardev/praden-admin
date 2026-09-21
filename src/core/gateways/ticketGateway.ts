import { Ticket, TicketPriority } from '@core/entities/ticket'
import { UUID } from '@core/types/types'
import { SupportTicketsFilters } from '@core/usecases/support/getSupportTickets'

export interface TicketGateway {
  list(filters?: SupportTicketsFilters): Promise<Array<Ticket>>
  getByUuid(uuid: UUID): Promise<Ticket>
  getByCustomerUuid(customerUuid: UUID): Promise<Array<Ticket>>
  getByOrderUuid(orderUuid: UUID): Promise<Array<Ticket>>
  addReply(
    ticketUuid: UUID,
    content: string,
    authorName: string,
    attachments?: Array<File>
  ): Promise<Ticket>
  addPrivateNote(
    ticketUuid: UUID,
    content: string,
    authorName: string,
    attachments?: Array<File>
  ): Promise<Ticket>
  updatePriority(ticketUuid: UUID, priority: TicketPriority): Promise<Ticket>
  start(ticketUuid: UUID): Promise<Ticket>
  resolve(ticketUuid: UUID): Promise<Ticket>
}
