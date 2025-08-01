import {
  CreateTicketPredefinedAnswerDTO,
  TicketPredefinedAnswerGateway,
  UpdateTicketPredefinedAnswerDTO
} from '@core/gateways/ticketPredefinedAnswerGateway'
import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'
import { UUID } from '@core/types/types'
import { RealGateway } from '../order-gateways/RealOrderGateway'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealTicketPredefinedAnswersGateway
  extends RealGateway
  implements TicketPredefinedAnswerGateway
{
  constructor(url: string) {
    super(url)
  }
  async list(): Promise<Array<TicketPredefinedAnswer>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/ticket-predefined-answers`
    )
    return Promise.resolve(res.data)
  }

  async getByUuid(uuid: UUID): Promise<TicketPredefinedAnswer> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/ticket-predefined-answers/${uuid}`
    )
    return Promise.resolve(res.data)
  }

  async create(
    dto: CreateTicketPredefinedAnswerDTO
  ): Promise<TicketPredefinedAnswer> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/ticket-predefined-answers`,
      dto
    )
    return Promise.resolve(res.data)
  }

  async update(
    uuid: UUID,
    dto: UpdateTicketPredefinedAnswerDTO
  ): Promise<TicketPredefinedAnswer> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/ticket-predefined-answers/${uuid}`,
      dto
    )
    return Promise.resolve(res.data)
  }

  async delete(uuid: UUID): Promise<void> {
    const res = await axiosWithBearer.delete(
      `${this.baseUrl}/ticket-predefined-answers/${uuid}`
    )
    return Promise.resolve(res.data)
  }
}
