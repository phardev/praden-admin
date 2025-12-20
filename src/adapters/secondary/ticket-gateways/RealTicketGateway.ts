import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { Ticket, TicketPriority } from '@core/entities/ticket'
import { TicketGateway } from '@core/gateways/ticketGateway'
import { UUID } from '@core/types/types'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealTicketGateway extends RealGateway implements TicketGateway {
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Ticket>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/tickets`)
    return Promise.resolve(res.data.items)
  }

  async getByUuid(uuid: UUID): Promise<Ticket> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/tickets/${uuid}`)
    return Promise.resolve(res.data)
  }

  async getByCustomerUuid(customerUuid: UUID): Promise<Array<Ticket>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/customers/${customerUuid}/tickets`
    )
    return Promise.resolve(res.data.items)
  }

  async getByOrderUuid(orderUuid: UUID): Promise<Array<Ticket>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/orders/${orderUuid}/tickets`
    )
    return Promise.resolve(res.data.items)
  }

  async addReply(
    ticketUuid: UUID,
    content: string,
    authorUuid: UUID,
    attachments: Array<File> = []
  ): Promise<Ticket> {
    const formData = this.createFormData({ content, attachments })

    const res = await axiosWithBearer.post(
      `${this.baseUrl}/tickets/${ticketUuid}/reply`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return Promise.resolve(res.data)
  }

  async addPrivateNote(
    ticketUuid: UUID,
    content: string,
    authorUuid: UUID,
    attachments: Array<File> = []
  ): Promise<Ticket> {
    const formData = this.createFormData({ content, attachments })
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/tickets/${ticketUuid}/notes`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return Promise.resolve(res.data)
  }

  async updatePriority(
    ticketUuid: UUID,
    priority: TicketPriority
  ): Promise<Ticket> {
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/tickets/${ticketUuid}`,
      { priority }
    )
    return Promise.resolve(res.data)
  }

  async start(ticketUuid: UUID): Promise<Ticket> {
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/tickets/${ticketUuid}/start`
    )
    return Promise.resolve(res.data)
  }

  async resolve(ticketUuid: UUID): Promise<Ticket> {
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/tickets/${ticketUuid}/resolve`
    )
    return Promise.resolve(res.data)
  }
}
