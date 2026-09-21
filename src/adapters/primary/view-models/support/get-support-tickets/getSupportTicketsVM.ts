import { ActiveFilterVM } from '@adapters/primary/view-models/shared/filters'
import {
  Ticket,
  TicketMessageType,
  TicketPriority,
  TicketStatus
} from '@core/entities/ticket'
import { UUID } from '@core/types/types'
import { SupportTicketsFilters } from '@core/usecases/support/getSupportTickets'
import { useTicketStore } from '@store/ticketStore'
import { getDisplayName } from '@utils/displayName'
import { timestampToLocaleString } from '@utils/formatters'

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

export interface KanbanColumnWithKey extends KanbanColumn {
  key: string
}

export interface GetSupportTicketsVM {
  columns: Array<KanbanColumnWithKey>
  currentFilters: SupportTicketsFilters
  activeFilters: Array<ActiveFilterVM>
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
  customerName: getDisplayName(ticket.customer),
  priority: ticket.priority,
  createdAt: ticket.createdAt,
  firstMessageContent:
    ticket.messages.length > 0 ? ticket.messages[0].content : ticket.description
})

const buildActiveFilters = (
  filters: SupportTicketsFilters
): Array<ActiveFilterVM> => {
  const activeFilters: Array<ActiveFilterVM> = []
  if (filters.customerQuery) {
    activeFilters.push({
      key: 'customerQuery',
      label: `Client : "${filters.customerQuery}"`
    })
  }
  if (filters.startDate) {
    activeFilters.push({
      key: 'startDate',
      label: `Depuis le ${timestampToLocaleString(filters.startDate, 'fr-FR')}`
    })
  }
  if (filters.endDate) {
    activeFilters.push({
      key: 'endDate',
      label: `Jusqu'au ${timestampToLocaleString(filters.endDate, 'fr-FR')}`
    })
  }
  return activeFilters
}

const isWaitingForAnswer = (ticket: Ticket): boolean => {
  if (ticket.status !== TicketStatus.STARTED || ticket.messages.length === 0) {
    return false
  }
  const withoutPrivateNotes = ticket.messages.filter(
    (m) => m.type !== TicketMessageType.PRIVATE
  )
  const lastMessage = withoutPrivateNotes[withoutPrivateNotes.length - 1]
  return lastMessage.authorUuid !== ticket.customer.uuid
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

  const columnOrder = [
    'new',
    'started',
    'waiting_for_answer',
    'resolved'
  ] as const
  const columnData: Record<string, KanbanColumn> = {
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

  const columns: Array<KanbanColumnWithKey> = columnOrder.map((key) => ({
    key,
    ...columnData[key]
  }))

  return {
    columns,
    currentFilters: ticketStore.filters,
    activeFilters: buildActiveFilters(ticketStore.filters),
    isLoading: ticketStore.isLoading
  }
}
