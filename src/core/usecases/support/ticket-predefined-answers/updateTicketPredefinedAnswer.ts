import {
  TicketPredefinedAnswerGateway,
  UpdateTicketPredefinedAnswerDTO
} from '@core/gateways/ticketPredefinedAnswerGateway'
import { UUID } from '@core/types/types'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'

export const updateTicketPredefinedAnswer = async (
  uuid: UUID,
  dto: UpdateTicketPredefinedAnswerDTO,
  ticketPredefinedAnswerGateway: TicketPredefinedAnswerGateway
): Promise<void> => {
  const updated = await ticketPredefinedAnswerGateway.update(uuid, dto)
  const ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
  ticketPredefinedAnswerStore.update(updated)
}
