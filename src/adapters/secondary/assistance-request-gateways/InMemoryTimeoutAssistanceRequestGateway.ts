import type {
  AssistanceRequest,
  AssistanceRequestDetails
} from '@core/entities/assistanceRequest'
import type {
  AssistanceRequestGateway,
  CreateAssistanceRequestDTO
} from '@core/gateways/assistanceRequestGateway'
import type { DateProvider } from '@core/gateways/dateProvider'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import { InMemoryAssistanceRequestGateway } from './InMemoryAssistanceRequestGateway'

export class InMemoryTimeoutAssistanceRequestGateway
  extends InMemoryAssistanceRequestGateway
  implements AssistanceRequestGateway
{
  private readonly timeoutInMs: number

  constructor(
    timeoutInMs: number,
    dateProvider: DateProvider,
    uuidGenerator: UuidGenerator
  ) {
    super(dateProvider, uuidGenerator)
    this.timeoutInMs = timeoutInMs
  }

  override list(): Promise<Array<AssistanceRequest>> {
    return this.delay(() => super.list())
  }

  override getById(id: string): Promise<AssistanceRequestDetails> {
    return this.delay(() => super.getById(id))
  }

  override create(
    dto: CreateAssistanceRequestDTO,
    attachments: Array<File>
  ): Promise<AssistanceRequest> {
    return this.delay(() => super.create(dto, attachments))
  }

  override addMessage(
    id: string,
    content: string,
    attachments: Array<File>
  ): Promise<AssistanceRequestDetails> {
    return this.delay(() => super.addMessage(id, content, attachments))
  }

  override resolve(id: string): Promise<AssistanceRequestDetails> {
    return this.delay(() => super.resolve(id))
  }

  override downloadAttachment(
    id: string,
    attachmentId: string
  ): Promise<string> {
    return this.delay(() => super.downloadAttachment(id, attachmentId))
  }

  private delay<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        operation().then(resolve, reject)
      }, this.timeoutInMs)
    })
  }
}
