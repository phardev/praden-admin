import { useTicketStore } from '@store/ticketStore'
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketMessageType
} from '@core/entities/ticket'
import { UUID } from '@core/types/types'

export interface TicketItemVM {
  uuid: UUID
  ticketNumber: string
  subject: string
  customerName: string
  priority: TicketPriority
  createdAt: number
  firstMessageContent: string
}

export interface KanbanColumn {
  count: number
  tickets: Array<TicketItemVM>
}

export interface GetSupportTicketsVM {
  columns: Record<string, KanbanColumn>
  isLoading: boolean
}

const priorityOrder: Record<TicketPriority, number> = {
  [TicketPriority.URGENT]: 0,
  [TicketPriority.HIGH]: 1,
  [TicketPriority.MEDIUM]: 2,
  [TicketPriority.LOW]: 3
}

const sortTicketsByPriority = (tickets: Array<Ticket>): Array<Ticket> => {
  return tickets.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff
    return b.createdAt - a.createdAt // Most recent first for same priority
  })
}

const mapTicketToVM = (ticket: Ticket): TicketItemVM => ({
  uuid: ticket.uuid,
  ticketNumber: ticket.ticketNumber,
  subject: ticket.subject,
  customerName: `${ticket.customer.firstname} ${ticket.customer.lastname}`,
  priority: ticket.priority,
  createdAt: ticket.createdAt,
  firstMessageContent:
    ticket.messages.length > 0 ? ticket.messages[0].content : ticket.description
})

const isWaitingForAnswer = (ticket: Ticket): boolean => {
  if (ticket.status !== TicketStatus.STARTED || ticket.messages.length === 0) {
    return false
  }
  const withoutPrivateNotes = ticket.messages.filter(
    (m) => m.type !== TicketMessageType.PRIVATE
  )
  const lastMessage = withoutPrivateNotes[withoutPrivateNotes.length - 1]
  return (
    lastMessage.authorName !==
    `${ticket.customer.firstname} ${ticket.customer.lastname}`
  )
}

export const getSupportTicketsVM = (): GetSupportTicketsVM => {
  const ticketStore = useTicketStore()
  const tickets = ticketStore.items

  const newTickets = tickets.filter((t) => t.status === TicketStatus.NEW)
  const startedTickets = tickets.filter(
    (t) => t.status === TicketStatus.STARTED && !isWaitingForAnswer(t)
  )
  const waitingForAnswerTickets = tickets.filter((t) => isWaitingForAnswer(t))
  const resolvedTickets = tickets.filter(
    (t) => t.status === TicketStatus.RESOLVED
  )

  const columns: Record<string, KanbanColumn> = {
    new: {
      count: newTickets.length,
      tickets: sortTicketsByPriority(newTickets).map(mapTicketToVM)
    },
    started: {
      count: startedTickets.length,
      tickets: sortTicketsByPriority(startedTickets).map(mapTicketToVM)
    },
    waiting_for_answer: {
      count: waitingForAnswerTickets.length,
      tickets: sortTicketsByPriority(waitingForAnswerTickets).map(mapTicketToVM)
    },
    resolved: {
      count: resolvedTickets.length,
      tickets: sortTicketsByPriority(resolvedTickets).map(mapTicketToVM)
    }
  }

  return {
    columns,
    isLoading: ticketStore.isLoading
  }
}
