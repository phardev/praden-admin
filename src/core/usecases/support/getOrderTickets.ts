import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const getOrderTickets = async (
  orderUuid: UUID,
  ticketGateway: TicketGateway
): Promise<void> => {
  const ticketStore = useTicketStore()
  try {
    ticketStore.startLoading()
    const tickets = await ticketGateway.getByOrderUuid(orderUuid)
    ticketStore.setOrderTickets(orderUuid, tickets)
  } finally {
    ticketStore.stopLoading()
  }
  return Promise.resolve()
}
