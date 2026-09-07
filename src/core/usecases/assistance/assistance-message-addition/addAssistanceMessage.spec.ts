import {
  InMemoryAssistanceRequestGateway,
  inMemoryOperatorName
} from '@adapters/secondary/assistance-request-gateways/InMemoryAssistanceRequestGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  AssistanceMessageSide,
  type AssistanceRequestDetails,
  AssistanceRequestStatus
} from '@core/entities/assistanceRequest'
import { AssistanceRequestDoesNotExistsError } from '@core/errors/AssistanceRequestDoesNotExistsError'
import { addAssistanceMessage } from '@core/usecases/assistance/assistance-message-addition/addAssistanceMessage'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import { assistanceNow } from '@utils/testData/assistanceNow'
import { waitingForAnswerPriceRequest } from '@utils/testData/assistanceRequests'
import { createPinia, setActivePinia } from 'pinia'

describe('Add assistance message', () => {
  let store: ReturnType<typeof useAssistanceRequestStore>
  let gateway: InMemoryAssistanceRequestGateway
  let dateProvider: FakeDateProvider
  let uuidGenerator: FakeUuidGenerator
  const now = assistanceNow
  const content = "Oui c'est bien l'étiquette en rayon."

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAssistanceRequestStore()
    dateProvider = new FakeDateProvider()
    uuidGenerator = new FakeUuidGenerator()
    gateway = new InMemoryAssistanceRequestGateway(dateProvider, uuidGenerator)
    dateProvider.feedWith(now)
    uuidGenerator.setNext('new-message')
  })

  describe('Given the request is waiting for the pharmacy answer', () => {
    beforeEach(() => {
      gateway.feedWith(waitingForAnswerPriceRequest)
    })

    it('should set the updated thread as current', async () => {
      await whenAddAssistanceMessage(waitingForAnswerPriceRequest.id)
      const expected: AssistanceRequestDetails = {
        ...waitingForAnswerPriceRequest,
        status: AssistanceRequestStatus.IN_PROGRESS,
        lastActivityAt: now,
        messages: [
          ...waitingForAnswerPriceRequest.messages,
          {
            id: 'new-message',
            side: AssistanceMessageSide.PHARMACY,
            author: inMemoryOperatorName,
            content,
            sentAt: now,
            attachments: []
          }
        ]
      }
      expect(store.current).toStrictEqual(expected)
    })
  })

  describe('Given the request does not exist', () => {
    it('should throw an error', async () => {
      await expect(whenAddAssistanceMessage('non-existent-id')).rejects.toThrow(
        AssistanceRequestDoesNotExistsError
      )
    })
  })

  const whenAddAssistanceMessage = async (id: string) => {
    await addAssistanceMessage(id, content, [], gateway)
  }
})
