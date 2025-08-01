import { TicketPredefinedAnswerGateway } from '@core/gateways/ticketPredefinedAnswerGateway'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'

export const listTicketPredefinedAnswers = async (
  ticketPredefinedAnswerGateway: TicketPredefinedAnswerGateway
): Promise<void> => {
  const ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
  try {
    ticketPredefinedAnswerStore.startLoading()
    const answers = await ticketPredefinedAnswerGateway.list()
    ticketPredefinedAnswerStore.list(answers)
  } finally {
    ticketPredefinedAnswerStore.stopLoading()
  }
}
