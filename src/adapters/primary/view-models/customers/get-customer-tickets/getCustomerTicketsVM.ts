import { useTicketStore } from '@store/ticketStore'
import { Ticket, TicketStatus, TicketPriority } from '@core/entities/ticket'
import { UUID } from '@core/types/types'

export interface CustomerTicketItemVM {
  uuid: UUID
  ticketNumber: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: number
  updatedAt: number
  firstMessageContent: string
}

export interface GetCustomerTicketsVM {
  tickets: Array<CustomerTicketItemVM>
  isLoading: boolean
}

const sortTicketsByDate = (tickets: Array<Ticket>): Array<Ticket> => {
  return tickets.sort((a, b) => b.createdAt - a.createdAt)
}

const mapTicketToVM = (ticket: Ticket): CustomerTicketItemVM => ({
  uuid: ticket.uuid,
  ticketNumber: ticket.ticketNumber,
  subject: ticket.subject,
  status: ticket.status,
  priority: ticket.priority,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
  firstMessageContent:
    ticket.messages.length > 0 ? ticket.messages[0].content : ticket.description
})

export const getCustomerTicketsVM = (
  customerUuid: UUID
): GetCustomerTicketsVM => {
  const ticketStore = useTicketStore()
  const tickets = ticketStore.getCustomerTickets(customerUuid)

  return {
    tickets: sortTicketsByDate(tickets).map(mapTicketToVM),
    isLoading: ticketStore.isLoading
  }
}
