import {
  type AssistanceAttachment,
  type AssistanceMessage,
  AssistanceMessageSide,
  type AssistanceRequest,
  type AssistanceRequestDetails,
  AssistanceRequestStatus
} from '@core/entities/assistanceRequest'
import { AssistanceRequestDoesNotExistsError } from '@core/errors/AssistanceRequestDoesNotExistsError'
import type {
  AssistanceRequestGateway,
  CreateAssistanceRequestDTO
} from '@core/gateways/assistanceRequestGateway'
import type { DateProvider } from '@core/gateways/dateProvider'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import type { HashTable } from '@core/types/types'
import { getFileContent } from '@utils/file'

export const inMemoryOperatorName = 'Marie Dupont'

export const REFERENCE_LENGTH = 5

const MAX_TITLE_LENGTH = 80

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const titleFromDescription = (description: string): string => {
  const firstLine =
    description
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.length > 0) ?? ''
  if (firstLine.length <= MAX_TITLE_LENGTH) return firstLine
  return `${firstLine.slice(0, MAX_TITLE_LENGTH)}…`
}

const toListItem = (details: AssistanceRequestDetails): AssistanceRequest => {
  return {
    id: details.id,
    reference: details.reference,
    category: details.category,
    ...(details.subject ? { subject: details.subject } : {}),
    title: details.title,
    author: details.author,
    status: details.status,
    createdAt: details.createdAt,
    lastActivityAt: details.lastActivityAt
  }
}

const statusAfterPharmacyMessage = (
  status: AssistanceRequestStatus
): AssistanceRequestStatus => {
  return status === AssistanceRequestStatus.WAITING_FOR_YOUR_ANSWER
    ? AssistanceRequestStatus.IN_PROGRESS
    : status
}

export class InMemoryAssistanceRequestGateway
  implements AssistanceRequestGateway
{
  private requests: Array<AssistanceRequestDetails> = []
  private attachmentContents: HashTable<string> = {}

  constructor(
    private dateProvider: DateProvider,
    private uuidGenerator: UuidGenerator
  ) {}

  list(): Promise<Array<AssistanceRequest>> {
    return Promise.resolve(this.requests.map(toListItem))
  }

  getById(id: string): Promise<AssistanceRequestDetails> {
    return Promise.resolve(deepClone(this.findOrThrow(id)))
  }

  async create(
    dto: CreateAssistanceRequestDTO,
    attachments: Array<File>
  ): Promise<AssistanceRequest> {
    const id = this.uuidGenerator.generate()
    const now = this.dateProvider.now()
    const details: AssistanceRequestDetails = {
      id,
      reference: String(this.requests.length + 1).padStart(
        REFERENCE_LENGTH,
        '0'
      ),
      category: dto.category,
      ...(dto.subject ? { subject: deepClone(dto.subject) } : {}),
      title: titleFromDescription(dto.description),
      author: inMemoryOperatorName,
      status: AssistanceRequestStatus.RECEIVED,
      createdAt: now,
      lastActivityAt: now,
      description: dto.description,
      messages: [
        {
          id: `${id}-report`,
          side: AssistanceMessageSide.PHARMACY,
          author: inMemoryOperatorName,
          content: dto.description,
          sentAt: now,
          attachments: await this.storeAttachments(id, attachments)
        }
      ]
    }
    this.requests.push(details)
    return toListItem(details)
  }

  async addMessage(
    id: string,
    content: string,
    attachments: Array<File>
  ): Promise<AssistanceRequestDetails> {
    const request = this.findOrThrow(id)
    const now = this.dateProvider.now()
    const messageId = this.uuidGenerator.generate()
    const message: AssistanceMessage = {
      id: messageId,
      side: AssistanceMessageSide.PHARMACY,
      author: inMemoryOperatorName,
      content,
      sentAt: now,
      attachments: await this.storeAttachments(messageId, attachments)
    }
    request.messages.push(message)
    request.status = statusAfterPharmacyMessage(request.status)
    request.lastActivityAt = now
    return deepClone(request)
  }

  resolve(id: string): Promise<AssistanceRequestDetails> {
    const request = this.findOrThrow(id)
    request.status = AssistanceRequestStatus.RESOLVED
    request.lastActivityAt = this.dateProvider.now()
    return Promise.resolve(deepClone(request))
  }

  downloadAttachment(id: string, attachmentId: string): Promise<string> {
    this.findOrThrow(id)
    const content = this.attachmentContents[attachmentId]
    if (!content) {
      return Promise.reject(
        new Error(`Attachment ${attachmentId} does not exist on request ${id}`)
      )
    }
    return Promise.resolve(content)
  }

  feedWith(...details: Array<AssistanceRequestDetails>): void {
    this.requests = deepClone(details)
  }

  feedAttachmentContentsWith(contents: HashTable<string>): void {
    this.attachmentContents = { ...contents }
  }

  private findOrThrow(id: string): AssistanceRequestDetails {
    const request = this.requests.find((r) => r.id === id)
    if (!request) throw new AssistanceRequestDoesNotExistsError(id)
    return request
  }

  private async storeAttachments(
    ownerId: string,
    files: Array<File>
  ): Promise<Array<AssistanceAttachment>> {
    const attachments: Array<AssistanceAttachment> = []
    for (const [index, file] of files.entries()) {
      const attachmentId = `${ownerId}-attachment-${index}`
      this.attachmentContents[attachmentId] = await getFileContent(file)
      attachments.push({
        id: attachmentId,
        filename: file.name,
        mimeType: file.type,
        size: file.size
      })
    }
    return attachments
  }
}
