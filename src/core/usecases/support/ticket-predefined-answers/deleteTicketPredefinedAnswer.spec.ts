import { InMemoryTicketPredefinedAnswerGateway } from '@adapters/secondary/ticket-predefined-answer-gateways/InMemoryTicketPredefinedAnswerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'
import { TicketPredefinedAnswerDoesNotExistsError } from '@core/errors/TicketPredefinedAnswerDoesNotExistsError'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'
import {
  orderShippedAnswer,
  problemResolvedAnswer,
  thankYouAnswer
} from '@utils/testData/ticketPredefinedAnswers'
import { createPinia, setActivePinia } from 'pinia'
import { deleteTicketPredefinedAnswer } from './deleteTicketPredefinedAnswer'

describe('Delete ticket predefined answer', () => {
  let ticketPredefinedAnswerStore: any
  let ticketPredefinedAnswerGateway: InMemoryTicketPredefinedAnswerGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
    ticketPredefinedAnswerGateway = new InMemoryTicketPredefinedAnswerGateway(
      uuidGenerator
    )
  })

  describe('Given existing ticket predefined answers', () => {
    beforeEach(() => {
      givenThereIsExistingTicketPredefinedAnswers(
        thankYouAnswer,
        orderShippedAnswer,
        problemResolvedAnswer
      )
    })

    describe('For deleting an existing answer', () => {
      it('should remove the first answer from gateway and store', async () => {
        await whenDeleteTicketPredefinedAnswer(thankYouAnswer.uuid)

        await expectTicketPredefinedAnswerGatewayToEqual(
          orderShippedAnswer,
          problemResolvedAnswer
        )
        expectTicketPredefinedAnswerStoreToEqual(
          orderShippedAnswer,
          problemResolvedAnswer
        )
      })

      it('should remove the middle answer from gateway and store', async () => {
        await whenDeleteTicketPredefinedAnswer(orderShippedAnswer.uuid)

        await expectTicketPredefinedAnswerGatewayToEqual(
          thankYouAnswer,
          problemResolvedAnswer
        )
        expectTicketPredefinedAnswerStoreToEqual(
          thankYouAnswer,
          problemResolvedAnswer
        )
      })

      it('should remove the last answer from gateway and store', async () => {
        await whenDeleteTicketPredefinedAnswer(problemResolvedAnswer.uuid)

        await expectTicketPredefinedAnswerGatewayToEqual(
          thankYouAnswer,
          orderShippedAnswer
        )
        expectTicketPredefinedAnswerStoreToEqual(
          thankYouAnswer,
          orderShippedAnswer
        )
      })
    })

    describe('For deleting a non-existing answer', () => {
      it('should throw TicketPredefinedAnswerDoesNotExistsError', async () => {
        const nonExistingUuid = 'non-existing-uuid'

        await expect(
          whenDeleteTicketPredefinedAnswer(nonExistingUuid)
        ).rejects.toThrow(
          new TicketPredefinedAnswerDoesNotExistsError(nonExistingUuid)
        )
      })
    })
  })

  describe('Given no existing ticket predefined answers', () => {
    it('should throw TicketPredefinedAnswerDoesNotExistsError', async () => {
      const nonExistingUuid = 'non-existing-uuid'

      await expect(
        whenDeleteTicketPredefinedAnswer(nonExistingUuid)
      ).rejects.toThrow(
        new TicketPredefinedAnswerDoesNotExistsError(nonExistingUuid)
      )
    })
  })

  const givenThereIsExistingTicketPredefinedAnswers = (
    ...answers: Array<TicketPredefinedAnswer>
  ) => {
    ticketPredefinedAnswerGateway.feedWith(...answers)
    ticketPredefinedAnswerStore.items = answers
  }

  const whenDeleteTicketPredefinedAnswer = async (uuid: string) => {
    await deleteTicketPredefinedAnswer(uuid, ticketPredefinedAnswerGateway)
  }

  const expectTicketPredefinedAnswerStoreToEqual = (
    ...answers: Array<TicketPredefinedAnswer>
  ) => {
    expect(ticketPredefinedAnswerStore.items).toStrictEqual(answers)
  }

  const expectTicketPredefinedAnswerGatewayToEqual = async (
    ...answers: Array<TicketPredefinedAnswer>
  ) => {
    expect(await ticketPredefinedAnswerGateway.list()).toStrictEqual(answers)
  }
})
