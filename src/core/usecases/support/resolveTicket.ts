import { TicketGateway } from '@core/gateways/TicketGateway'
import { useTicketStore } from '@store/ticketStore'
import { UUID } from '@core/types/types'

export const resolveTicket = async (
  ticketUuid: UUID,
  ticketGateway: TicketGateway
): Promise<void> => {
  const updatedTicket = await ticketGateway.resolve(ticketUuid)
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)

  return Promise.resolve()
}
