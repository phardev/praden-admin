import { InMemoryAssistanceRequestGateway } from '@adapters/secondary/assistance-request-gateways/InMemoryAssistanceRequestGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  type AssistanceRequestDetails,
  AssistanceRequestStatus
} from '@core/entities/assistanceRequest'
import { resolveAssistanceRequest } from '@core/usecases/assistance/assistance-request-resolution/resolveAssistanceRequest'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import { assistanceNow } from '@utils/testData/assistanceNow'
import { waitingForAnswerPriceRequest } from '@utils/testData/assistanceRequests'
import { createPinia, setActivePinia } from 'pinia'

describe('Resolve assistance request', () => {
  let store: ReturnType<typeof useAssistanceRequestStore>
  let gateway: InMemoryAssistanceRequestGateway
  let dateProvider: FakeDateProvider
  const now = assistanceNow
  const expected: AssistanceRequestDetails = {
    ...waitingForAnswerPriceRequest,
    status: AssistanceRequestStatus.RESOLVED,
    lastActivityAt: now
  }

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = useAssistanceRequestStore()
    dateProvider = new FakeDateProvider()
    gateway = new InMemoryAssistanceRequestGateway(
      dateProvider,
      new FakeUuidGenerator()
    )
    gateway.feedWith(waitingForAnswerPriceRequest)
    dateProvider.feedWith(now)
    await resolveAssistanceRequest(waitingForAnswerPriceRequest.id, gateway)
  })

  it('should set the resolved request as current', () => {
    expect(store.current).toStrictEqual(expected)
  })

  it('should persist the resolution', async () => {
    const details = await gateway.getById(waitingForAnswerPriceRequest.id)
    expect(details).toStrictEqual(expected)
  })
})
