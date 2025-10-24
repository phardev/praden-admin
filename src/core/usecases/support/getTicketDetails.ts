import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const getTicketDetails = async (
  ticketUuid: UUID,
  ticketGateway: TicketGateway
): Promise<void> => {
  const ticketStore = useTicketStore()
  try {
    ticketStore.startLoading()
    const ticket = await ticketGateway.getByUuid(ticketUuid)
    ticketStore.setCurrentTicket(ticket)
  } finally {
    ticketStore.stopLoading()
  }
  return Promise.resolve()
}
