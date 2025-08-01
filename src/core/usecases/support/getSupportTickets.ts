import { TicketGateway } from '@core/gateways/ticketGateway'
import { useTicketStore } from '@store/ticketStore'

export const getSupportTickets = async (
  ticketGateway: TicketGateway
): Promise<void> => {
  const ticketStore = useTicketStore()
  try {
    ticketStore.startLoading()
    const tickets = await ticketGateway.list()
    ticketStore.setTickets(tickets)
  } finally {
    ticketStore.stopLoading()
  }
  return Promise.resolve()
}
