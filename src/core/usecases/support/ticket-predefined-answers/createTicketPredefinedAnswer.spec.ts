import { createPinia, setActivePinia } from 'pinia'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { CreateTicketPredefinedAnswerDTO } from '@core/gateways/ticketPredefinedAnswerGateway'
import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'
import { UUID } from '@core/types/types'
import {
  thankYouAnswer,
  orderShippedAnswer
} from '@utils/testData/ticketPredefinedAnswers'
import { createTicketPredefinedAnswer } from './createTicketPredefinedAnswer'
import { InMemoryTicketPredefinedAnswerGateway } from '@adapters/secondary/ticket-predefined-answer-gateways/InMemoryTicketPredefinedAnswerGateway'
import { useTicketPredefinedAnswerStore } from '@store/ticketPredefinedAnswerStore'

describe('Create ticket predefinedanswer', () => {
  let ticketPredefinedAnswerStore: any
  let ticketPredefinedAnswerGateway: InMemoryTicketPredefinedAnswerGateway
  const uuidGenerator = new FakeUuidGenerator()
  let uuid: UUID
  let dto: CreateTicketPredefinedAnswerDTO
  let expectedAnswer: TicketPredefinedAnswer

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketPredefinedAnswerStore = useTicketPredefinedAnswerStore()
    ticketPredefinedAnswerGateway = new InMemoryTicketPredefinedAnswerGateway(
      uuidGenerator
    )
  })

  describe('For a ticket predefined answer', () => {
    beforeEach(async () => {
      uuid = 'new-uuid'
      uuidGenerator.setNext(uuid)
      dto = {
        title: 'Created Answer',
        content: 'This is a created answer content'
      }
      expectedAnswer = {
        uuid,
        title: dto.title,
        content: dto.content
      }
      await whenCreateTicketPredefinedAnswer(dto)
    })

    it('should save the ticket predefined answer in gateway', async () => {
      await expectTicketPredefinedAnswerGatewayToEqual(expectedAnswer)
    })

    it('should save the ticket predefined answer in store', () => {
      expectTicketPredefinedAnswerStoreToEqual(expectedAnswer)
    })
  })

  describe('For another ticket predefined answer', () => {
    beforeEach(async () => {
      givenThereIsExistingTicketPredefinedAnswers(
        thankYouAnswer,
        orderShippedAnswer
      )
      uuid = 'another-uuid'
      uuidGenerator.setNext(uuid)
      dto = {
        title: 'Another Created Answer',
        content: 'Another created answer content with more details'
      }
      expectedAnswer = {
        uuid,
        title: dto.title,
        content: dto.content
      }
      await whenCreateTicketPredefinedAnswer(dto)
    })

    it('should save the ticket predefined answer in gateway', async () => {
      await expectTicketPredefinedAnswerGatewayToEqual(
        thankYouAnswer,
        orderShippedAnswer,
        expectedAnswer
      )
    })

    it('should save the ticket predefined answer in store', () => {
      expectTicketPredefinedAnswerStoreToEqual(
        thankYouAnswer,
        orderShippedAnswer,
        expectedAnswer
      )
    })
  })

  const givenThereIsExistingTicketPredefinedAnswers = (
    ...answers: Array<TicketPredefinedAnswer>
  ) => {
    ticketPredefinedAnswerGateway.feedWith(...answers)
    ticketPredefinedAnswerStore.items = answers
  }

  const whenCreateTicketPredefinedAnswer = async (
    dto: CreateTicketPredefinedAnswerDTO
  ) => {
    await createTicketPredefinedAnswer(dto, ticketPredefinedAnswerGateway)
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
