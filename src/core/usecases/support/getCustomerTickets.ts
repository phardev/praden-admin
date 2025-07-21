import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { useTicketStore } from '@store/ticketStore'

export const getCustomerTickets = async (
  customerUuid: UUID,
  ticketGateway: TicketGateway
): Promise<void> => {
  const ticketStore = useTicketStore()
  try {
    ticketStore.startLoading()
    const tickets = await ticketGateway.getByCustomerUuid(customerUuid)
    ticketStore.setCustomerTickets(customerUuid, tickets)
  } finally {
    ticketStore.stopLoading()
  }
  return Promise.resolve()
}
