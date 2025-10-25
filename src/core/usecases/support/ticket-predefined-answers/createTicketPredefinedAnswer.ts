import {
  CreateTicketPredefinedAnswerDTO,
  TicketPredefinedAnswerGateway
} from '@core/gateways/ticketPredefinedAnswerGateway'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'

export const createTicketPredefinedAnswer = async (
  dto: CreateTicketPredefinedAnswerDTO,
  ticketPredefinedAnswerGateway: TicketPredefinedAnswerGateway
): Promise<void> => {
  const created = await ticketPredefinedAnswerGateway.create(dto)
  const ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
  ticketPredefinedAnswerStore.add(created)
}
