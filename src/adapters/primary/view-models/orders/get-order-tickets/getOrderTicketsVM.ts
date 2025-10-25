import { Ticket, TicketPriority, TicketStatus } from '@core/entities/ticket'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export interface OrderTicketItemVM {
  uuid: UUID
  ticketNumber: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: number
  updatedAt: number
  firstMessageContent: string
}

export interface GetOrderTicketsVM {
  tickets: Array<OrderTicketItemVM>
  isLoading: boolean
}

const sortTicketsByDate = (tickets: Array<Ticket>): Array<Ticket> => {
  return tickets.sort((a, b) => b.createdAt - a.createdAt)
}

const mapTicketToVM = (ticket: Ticket): OrderTicketItemVM => ({
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

export const getOrderTicketsVM = (orderUuid: UUID): GetOrderTicketsVM => {
  const ticketStore = useTicketStore()
  const tickets = ticketStore.getOrderTickets(orderUuid)

  return {
    tickets: sortTicketsByDate(tickets).map(mapTicketToVM),
    isLoading: ticketStore.isLoading
  }
}
