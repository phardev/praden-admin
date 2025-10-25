import { InMemoryTicketPredefinedAnswerGateway } from '@adapters/secondary/ticket-predefined-answer-gateways/InMemoryTicketPredefinedAnswerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'
import { listTicketPredefinedAnswers } from '@core/usecases/support/ticket-predefined-answers/listTicketPredefinedAnswers'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'
import {
  orderShippedAnswer,
  problemResolvedAnswer,
  thankYouAnswer
} from '@utils/testData/ticketPredefinedAnswers'
import { createPinia, setActivePinia } from 'pinia'

describe('List ticket predefined answers', () => {
  let ticketPredefinedAnswerStore: any
  let ticketPredefinedAnswerGateway: InMemoryTicketPredefinedAnswerGateway
  let uuidGenerator: FakeUuidGenerator

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
    uuidGenerator = new FakeUuidGenerator()
    ticketPredefinedAnswerGateway = new InMemoryTicketPredefinedAnswerGateway(
      uuidGenerator
    )
  })

  describe('Given there are no ticket predefined answers', () => {
    it('should list empty array', async () => {
      await whenListTicketPredefinedAnswers()
      expect(ticketPredefinedAnswerStore.items).toStrictEqual([])
    })
  })

  describe('Given there are existing ticket predefined answers', () => {
    beforeEach(() => {
      givenExistingTicketPredefinedAnswers(
        thankYouAnswer,
        orderShippedAnswer,
        problemResolvedAnswer
      )
    })

    it('should list all ticket predefined answers', async () => {
      await whenListTicketPredefinedAnswers()
      expect(ticketPredefinedAnswerStore.items).toStrictEqual([
        thankYouAnswer,
        orderShippedAnswer,
        problemResolvedAnswer
      ])
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      let isLoadingDuringOperation = false
      const unsubscribe = ticketPredefinedAnswerStore.$subscribe(
        (_mutation: any, state: any) => {
          if (state.isLoading) {
            isLoadingDuringOperation = true
          }
          unsubscribe()
        }
      )
      await whenListTicketPredefinedAnswers()
      expect(isLoadingDuringOperation).toBe(true)
    })

    it('should be aware when loading is done', async () => {
      await whenListTicketPredefinedAnswers()
      expect(ticketPredefinedAnswerStore.isLoading).toBe(false)
    })
  })

  const givenExistingTicketPredefinedAnswers = (
    ...answers: Array<TicketPredefinedAnswer>
  ) => {
    ticketPredefinedAnswerGateway.feedWith(...answers)
  }

  const whenListTicketPredefinedAnswers = async () => {
    await listTicketPredefinedAnswers(ticketPredefinedAnswerGateway)
  }
})
