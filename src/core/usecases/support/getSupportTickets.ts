import { TicketGateway } from '@core/gateways/ticketGateway'
import { Timestamp } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export interface SupportTicketsFilters {
  customerQuery?: string
  startDate?: Timestamp
  endDate?: Timestamp
}

export const getSupportTickets = async (
  ticketGateway: TicketGateway,
  filters: SupportTicketsFilters = {}
): Promise<void> => {
  const ticketStore = useTicketStore()
  ticketStore.setFilters(filters)
  try {
    ticketStore.startLoading()
    const tickets = await ticketGateway.list(filters)
    ticketStore.setTickets(tickets)
  } finally {
    ticketStore.stopLoading()
  }
  return Promise.resolve()
}
