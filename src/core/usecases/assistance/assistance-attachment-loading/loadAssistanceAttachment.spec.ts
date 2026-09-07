import { InMemoryAssistanceRequestGateway } from '@adapters/secondary/assistance-request-gateways/InMemoryAssistanceRequestGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { loadAssistanceAttachment } from '@core/usecases/assistance/assistance-attachment-loading/loadAssistanceAttachment'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import { assistanceAttachmentContents } from '@utils/testData/assistanceAttachmentContents'
import { waitingForAnswerPriceRequest } from '@utils/testData/assistanceRequests'
import { createPinia, setActivePinia } from 'pinia'

describe('Load assistance attachment', () => {
  let store: ReturnType<typeof useAssistanceRequestStore>
  let gateway: InMemoryAssistanceRequestGateway
  const attachmentId = 'attachment-1'
  const fedUrl = assistanceAttachmentContents[attachmentId]

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = useAssistanceRequestStore()
    gateway = new InMemoryAssistanceRequestGateway(
      new FakeDateProvider(),
      new FakeUuidGenerator()
    )
    gateway.feedWith(waitingForAnswerPriceRequest)
    gateway.feedAttachmentContentsWith(assistanceAttachmentContents)
    await whenLoadAssistanceAttachment()
  })

  it('should store the attachment url', () => {
    expect(store.attachmentUrls[attachmentId]).toStrictEqual(fedUrl)
  })

  it('should keep the first loaded url on a second call', async () => {
    gateway.feedAttachmentContentsWith({
      [attachmentId]: 'data:image/png;base64,other='
    })
    await whenLoadAssistanceAttachment()
    expect(store.attachmentUrls[attachmentId]).toStrictEqual(fedUrl)
  })

  const whenLoadAssistanceAttachment = async () => {
    await loadAssistanceAttachment(
      waitingForAnswerPriceRequest.id,
      attachmentId,
      gateway
    )
  }
})
