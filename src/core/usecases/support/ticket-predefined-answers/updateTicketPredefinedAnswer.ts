import {
  TicketPredefinedAnswerGateway,
  UpdateTicketPredefinedAnswerDTO
} from '@core/gateways/ticketPredefinedAnswerGateway'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'
import { UUID } from '@core/types/types'

export const updateTicketPredefinedAnswer = async (
  uuid: UUID,
  dto: UpdateTicketPredefinedAnswerDTO,
  ticketPredefinedAnswerGateway: TicketPredefinedAnswerGateway
): Promise<void> => {
  const updated = await ticketPredefinedAnswerGateway.update(uuid, dto)
  const ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
  ticketPredefinedAnswerStore.update(updated)
}
