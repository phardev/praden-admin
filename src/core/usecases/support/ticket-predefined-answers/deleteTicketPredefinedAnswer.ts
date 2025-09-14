import { TicketPredefinedAnswerGateway } from '@core/gateways/ticketPredefinedAnswerGateway'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'
import { UUID } from '@core/types/types'

export const deleteTicketPredefinedAnswer = async (
  uuid: UUID,
  ticketPredefinedAnswerGateway: TicketPredefinedAnswerGateway
): Promise<void> => {
  await ticketPredefinedAnswerGateway.delete(uuid)
  const ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
  ticketPredefinedAnswerStore.remove(uuid)
}
