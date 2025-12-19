import type { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const resolveTicket = async (
  ticketUuid: UUID,
  ticketGateway: TicketGateway
): Promise<void> => {
  const updatedTicket = await ticketGateway.resolve(ticketUuid)
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)

  return Promise.resolve()
}
