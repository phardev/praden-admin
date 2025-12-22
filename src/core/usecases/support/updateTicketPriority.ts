import { TicketPriority } from '@core/entities/ticket'
import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const updateTicketPriority = async (
  ticketUuid: UUID,
  priority: TicketPriority,
  ticketGateway: TicketGateway
): Promise<void> => {
  const updatedTicket = await ticketGateway.updatePriority(ticketUuid, priority)
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)

  return Promise.resolve()
}
