import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'
import { updateTicketPredefinedAnswer } from '@core/usecases/support/ticket-predefined-answers/updateTicketPredefinedAnswer'
import { createPinia, setActivePinia } from 'pinia'
import { InMemoryTicketPredefinedAnswerGateway } from '@adapters/secondary/ticket-predefined-answer-gateways/InMemoryTicketPredefinedAnswerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UpdateTicketPredefinedAnswerDTO } from '@core/gateways/ticketPredefinedAnswerGateway'
import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'
import {
  thankYouAnswer,
  orderShippedAnswer,
  problemResolvedAnswer
} from '@utils/testData/ticketPredefinedAnswers'
import { TicketPredefinedAnswerDoesNotExistsError } from '@core/errors/TicketPredefinedAnswerDoesNotExistsError'

describe('Update ticket predefined answer', () => {
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

    describe('For updating an existing answer', () => {
      it('should update the answer in gateway and store', async () => {
        const dto: UpdateTicketPredefinedAnswerDTO = {
          title: 'Updated Thank You',
          content: 'Updated thank you message content'
        }
        const expectedAnswer: TicketPredefinedAnswer = {
          uuid: thankYouAnswer.uuid,
          title: dto.title,
          content: dto.content
        }

        await whenUpdateTicketPredefinedAnswer(thankYouAnswer.uuid, dto)

        await expectTicketPredefinedAnswerGatewayToEqual(
          expectedAnswer,
          orderShippedAnswer,
          problemResolvedAnswer
        )
        expectTicketPredefinedAnswerStoreToEqual(
          expectedAnswer,
          orderShippedAnswer,
          problemResolvedAnswer
        )
      })

      it('should update another answer', async () => {
        const dto: UpdateTicketPredefinedAnswerDTO = {
          title: 'Updated Order Status',
          content: 'Your order has been processed and will be shipped soon'
        }
        const expectedAnswer: TicketPredefinedAnswer = {
          uuid: orderShippedAnswer.uuid,
          title: dto.title,
          content: dto.content
        }

        await whenUpdateTicketPredefinedAnswer(orderShippedAnswer.uuid, dto)

        await expectTicketPredefinedAnswerGatewayToEqual(
          thankYouAnswer,
          expectedAnswer,
          problemResolvedAnswer
        )
        expectTicketPredefinedAnswerStoreToEqual(
          thankYouAnswer,
          expectedAnswer,
          problemResolvedAnswer
        )
      })
    })

    describe('For updating a non-existing answer', () => {
      it('should throw TicketPredefinedAnswerDoesNotExistsError', async () => {
        const nonExistingUuid = 'non-existing-uuid'
        const dto: UpdateTicketPredefinedAnswerDTO = {
          title: 'Should Not Work',
          content: 'This should not work'
        }

        await expect(
          whenUpdateTicketPredefinedAnswer(nonExistingUuid, dto)
        ).rejects.toThrow(
          new TicketPredefinedAnswerDoesNotExistsError(nonExistingUuid)
        )
      })
    })
  })

  const givenThereIsExistingTicketPredefinedAnswers = (
    ...answers: Array<TicketPredefinedAnswer>
  ) => {
    ticketPredefinedAnswerGateway.feedWith(...answers)
    ticketPredefinedAnswerStore.items = answers
  }

  const whenUpdateTicketPredefinedAnswer = async (
    uuid: string,
    dto: UpdateTicketPredefinedAnswerDTO
  ) => {
    await updateTicketPredefinedAnswer(uuid, dto, ticketPredefinedAnswerGateway)
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
