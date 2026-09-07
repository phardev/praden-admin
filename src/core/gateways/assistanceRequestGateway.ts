import type {
  AssistanceRequest,
  AssistanceRequestCategory,
  AssistanceRequestDetails,
  AssistanceSubject
} from '@core/entities/assistanceRequest'

export interface CreateAssistanceRequestDTO {
  category: AssistanceRequestCategory
  subject?: AssistanceSubject
  description: string
}

export interface AssistanceRequestGateway {
  list(): Promise<Array<AssistanceRequest>>
  getById(id: string): Promise<AssistanceRequestDetails>
  create(
    dto: CreateAssistanceRequestDTO,
    attachments: Array<File>
  ): Promise<AssistanceRequest>
  addMessage(
    id: string,
    content: string,
    attachments: Array<File>
  ): Promise<AssistanceRequestDetails>
  resolve(id: string): Promise<AssistanceRequestDetails>
  downloadAttachment(id: string, attachmentId: string): Promise<string>
}
