import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const startTicket = async (
  ticketUuid: UUID,
  ticketGateway: TicketGateway
): Promise<void> => {
  await ticketGateway.start(ticketUuid)
  const updatedTicket = await ticketGateway.getByUuid(ticketUuid)
  const ticketStore = useTicketStore()
  ticketStore.updateTicket(updatedTicket)
}
