import { Ticket, TicketMessage, TicketPriority } from '@core/entities/ticket'
import { UUID } from '@core/types/types'

export interface TicketGateway {
  list(): Promise<Array<Ticket>>
  getByUuid(uuid: UUID): Promise<Ticket>
  getByCustomerUuid(customerUuid: UUID): Promise<Array<Ticket>>
  getByOrderUuid(orderUuid: UUID): Promise<Array<Ticket>>
  addReply(ticketUuid: UUID, message: TicketMessage): Promise<Ticket>
  addPrivateNote(ticketUuid: UUID, note: TicketMessage): Promise<Ticket>
  updatePriority(ticketUuid: UUID, priority: TicketPriority): Promise<Ticket>
  start(ticketUuid: UUID): Promise<Ticket>
  resolve(ticketUuid: UUID): Promise<Ticket>
}
