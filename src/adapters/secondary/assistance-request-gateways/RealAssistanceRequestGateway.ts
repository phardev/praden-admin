import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import type {
  AssistanceRequest,
  AssistanceRequestDetails
} from '@core/entities/assistanceRequest'
import { AssistanceRequestDoesNotExistsError } from '@core/errors/AssistanceRequestDoesNotExistsError'
import type {
  AssistanceRequestGateway,
  CreateAssistanceRequestDTO
} from '@core/gateways/assistanceRequestGateway'
import { isAxiosError } from 'axios'
import { RealGateway } from '../order-gateways/RealOrderGateway'

const multipartHeaders = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

export class RealAssistanceRequestGateway
  extends RealGateway
  implements AssistanceRequestGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<AssistanceRequest>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/assistance-requests`)
    return res.data.items
  }

  async getById(id: string): Promise<AssistanceRequestDetails> {
    try {
      const res = await axiosWithBearer.get(
        `${this.baseUrl}/assistance-requests/${id}`
      )
      return res.data.item
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new AssistanceRequestDoesNotExistsError(id)
      }
      throw error
    }
  }

  async create(
    dto: CreateAssistanceRequestDTO,
    attachments: Array<File>
  ): Promise<AssistanceRequest> {
    const formData = this.createFormData({
      category: dto.category,
      description: dto.description,
      subject: dto.subject ? JSON.stringify(dto.subject) : undefined,
      attachments
    })
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/assistance-requests`,
      formData,
      multipartHeaders
    )
    return res.data.item
  }

  async addMessage(
    id: string,
    content: string,
    attachments: Array<File>
  ): Promise<AssistanceRequestDetails> {
    const formData = this.createFormData({ content, attachments })
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/assistance-requests/${id}/messages`,
      formData,
      multipartHeaders
    )
    return res.data.item
  }

  async resolve(id: string): Promise<AssistanceRequestDetails> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/assistance-requests/${id}/resolve`
    )
    return res.data.item
  }

  async downloadAttachment(id: string, attachmentId: string): Promise<string> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/assistance-requests/${id}/attachments/${attachmentId}`,
      { responseType: 'blob' }
    )
    return URL.createObjectURL(res.data)
  }
}
