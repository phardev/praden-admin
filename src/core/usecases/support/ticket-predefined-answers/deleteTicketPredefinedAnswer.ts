import { TicketPredefinedAnswerGateway } from '@core/gateways/ticketPredefinedAnswerGateway'
import { UUID } from '@core/types/types'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'

export const deleteTicketPredefinedAnswer = async (
  uuid: UUID,
  ticketPredefinedAnswerGateway: TicketPredefinedAnswerGateway
): Promise<void> => {
  await ticketPredefinedAnswerGateway.delete(uuid)
  const ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
  ticketPredefinedAnswerStore.remove(uuid)
}
