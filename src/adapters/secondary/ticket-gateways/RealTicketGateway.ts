import { TicketGateway } from '@core/gateways/ticketGateway'
import { Ticket, TicketMessage, TicketPriority } from '@core/entities/ticket'
import { UUID } from '@core/types/types'
import { RealGateway } from '../order-gateways/RealOrderGateway'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

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

  async addReply(ticketUuid: UUID, message: TicketMessage): Promise<Ticket> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/tickets/${ticketUuid}/reply`,
      message
    )
    return Promise.resolve(res.data)
  }

  async addPrivateNote(ticketUuid: UUID, note: TicketMessage): Promise<Ticket> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/tickets/${ticketUuid}/notes`,
      note
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
