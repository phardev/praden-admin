import { createPinia, setActivePinia } from 'pinia'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'
import {
  getTicketPredefinedAnswersVM,
  GetTicketPredefinedAnswersVM
} from '@adapters/primary/view-models/support/ticket-predefined-answers/ticketPredefinedAnswersVM'
import {
  thankYouAnswer,
  orderShippedAnswer,
  problemResolvedAnswer
} from '@utils/testData/ticketPredefinedAnswers'

describe('Get ticket predefined answers VM', () => {
  let ticketPredefinedAnswerStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
  })

  describe('Given there are no ticket predefined answers', () => {
    it('should return empty answers array', () => {
      expectVMToMatch({ answers: [] })
    })

    it('should not be loading', () => {
      expectVMToMatch({ isLoading: false })
    })
  })

  describe('Given there are ticket predefined answers', () => {
    beforeEach(() => {
      ticketPredefinedAnswerStore.items = [
        thankYouAnswer,
        orderShippedAnswer,
        problemResolvedAnswer
      ]
    })

    it('should return formatted answers', () => {
      const expectedVM: Partial<GetTicketPredefinedAnswersVM> = {
        answers: [
          {
            uuid: thankYouAnswer.uuid,
            title: thankYouAnswer.title,
            content: thankYouAnswer.content
          },
          {
            uuid: orderShippedAnswer.uuid,
            title: orderShippedAnswer.title,
            content: orderShippedAnswer.content
          },
          {
            uuid: problemResolvedAnswer.uuid,
            title: problemResolvedAnswer.title,
            content: problemResolvedAnswer.content
          }
        ]
      }
      expectVMToMatch(expectedVM)
    })
  })

  describe('Given store is loading', () => {
    beforeEach(() => {
      ticketPredefinedAnswerStore.isLoading = true
    })

    it('should return loading state', () => {
      expectVMToMatch({ isLoading: true })
    })
  })

  const expectVMToMatch = (
    expectedVM: Partial<GetTicketPredefinedAnswersVM>
  ) => {
    const emptyVM: GetTicketPredefinedAnswersVM = {
      answers: [],
      isLoading: false
    }
    expect(getTicketPredefinedAnswersVM()).toMatchObject({
      ...emptyVM,
      ...expectedVM
    })
  }
})
