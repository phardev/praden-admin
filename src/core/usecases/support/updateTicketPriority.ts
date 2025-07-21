import { TicketGateway } from '@core/gateways/TicketGateway'
import { TicketPriority } from '@core/entities/ticket'
import { useTicketStore } from '@store/ticketStore'
import { UUID } from '@core/types/types'

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
