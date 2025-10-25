import { UUID } from '@core/types/types'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'

export interface TicketPredefinedAnswerItemVM {
  uuid: UUID
  title: string
  content: string
}

export interface GetTicketPredefinedAnswersVM {
  answers: Array<TicketPredefinedAnswerItemVM>
  isLoading: boolean
}

const mapTicketPredefinedAnswerToVM = (
  answer: any
): TicketPredefinedAnswerItemVM => ({
  uuid: answer.uuid,
  title: answer.title,
  content: answer.content
})

export const getTicketPredefinedAnswersVM =
  (): GetTicketPredefinedAnswersVM => {
    const ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
    const answers = ticketPredefinedAnswerStore.items

    return {
      answers: answers.map(mapTicketPredefinedAnswerToVM),
      isLoading: ticketPredefinedAnswerStore.isLoading
    }
  }
