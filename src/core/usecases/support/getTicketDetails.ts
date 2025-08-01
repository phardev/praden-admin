import { TicketGateway } from '@core/gateways/ticketGateway'
import { useTicketStore } from '@store/ticketStore'
import { UUID } from '@core/types/types'

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
