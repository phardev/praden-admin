import {
  InMemoryAssistanceRequestGateway,
  inMemoryOperatorName,
  REFERENCE_LENGTH
} from '@adapters/secondary/assistance-request-gateways/InMemoryAssistanceRequestGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  type AssistanceRequest,
  AssistanceRequestCategory,
  AssistanceRequestStatus,
  AssistanceSubjectType
} from '@core/entities/assistanceRequest'
import type { CreateAssistanceRequestDTO } from '@core/gateways/assistanceRequestGateway'
import { createAssistanceRequest } from '@core/usecases/assistance/assistance-request-creation/createAssistanceRequest'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import { getFileContent } from '@utils/file'
import { assistanceNow } from '@utils/testData/assistanceNow'
import * as fixtures from '@utils/testData/assistanceRequests'
import { orderToPrepare1 } from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'

const allRequests = Object.values(fixtures)

describe('Create assistance request', () => {
  let store: ReturnType<typeof useAssistanceRequestStore>
  let gateway: InMemoryAssistanceRequestGateway
  let dateProvider: FakeDateProvider
  let uuidGenerator: FakeUuidGenerator
  const now = assistanceNow
  const firstLine = 'Le client dit avoir payé mais la commande est en attente'
  const dto: CreateAssistanceRequestDTO = {
    category: AssistanceRequestCategory.ORDER,
    subject: {
      type: AssistanceSubjectType.ORDER,
      label: `${orderToPrepare1.deliveryAddress.firstname} ${orderToPrepare1.deliveryAddress.lastname}`,
      uuid: orderToPrepare1.uuid,
      pageUrl: `/orders/${orderToPrepare1.uuid}`
    },
    description: `${firstLine}\nIl a un reçu de paiement daté de ce matin.`
  }
  const file = new File(['capture'], 'c.png', { type: 'image/png' })
  const expectedItem: AssistanceRequest = {
    id: 'new-request',
    reference: String(allRequests.length + 1).padStart(REFERENCE_LENGTH, '0'),
    category: dto.category,
    subject: dto.subject,
    title: firstLine,
    author: inMemoryOperatorName,
    status: AssistanceRequestStatus.RECEIVED,
    createdAt: now,
    lastActivityAt: now
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAssistanceRequestStore()
    dateProvider = new FakeDateProvider()
    uuidGenerator = new FakeUuidGenerator()
    gateway = new InMemoryAssistanceRequestGateway(dateProvider, uuidGenerator)
    gateway.feedWith(...allRequests)
    dateProvider.feedWith(now)
    uuidGenerator.setNext('new-request')
  })

  describe('Given a request with an attachment is sent', () => {
    beforeEach(async () => {
      await whenCreateAssistanceRequest([file])
    })

    it('should prepend the created request to the items', () => {
      expect(store.items[0]).toStrictEqual(expectedItem)
    })

    it('should remember the last created request', () => {
      expect(store.lastCreated).toStrictEqual(expectedItem)
    })

    it('should attach the file to the report message', async () => {
      const details = await gateway.getById(expectedItem.id)
      expect(details.messages[0].attachments[0]).toStrictEqual({
        id: 'new-request-attachment-0',
        filename: file.name,
        mimeType: file.type,
        size: file.size
      })
    })

    it('should make the attachment content downloadable', async () => {
      const expectedContent = await getFileContent(file)
      const content = await gateway.downloadAttachment(
        expectedItem.id,
        'new-request-attachment-0'
      )
      expect(content).toStrictEqual(expectedContent)
    })
  })

  const whenCreateAssistanceRequest = async (attachments: Array<File>) => {
    await createAssistanceRequest(dto, attachments, gateway)
  }
})
