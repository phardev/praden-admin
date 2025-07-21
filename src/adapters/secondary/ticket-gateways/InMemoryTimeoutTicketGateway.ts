import { Ticket, TicketMessage, TicketPriority } from '@core/entities/ticket'
import { UUID } from '@core/types/types'
import { TicketGateway } from '@core/gateways/ticketGateway'
import { InMemoryTicketGateway } from './InMemoryTicketGateway'
import { DateProvider } from '@core/gateways/dateProvider'

export class InMemoryTimeoutTicketGateway
  extends InMemoryTicketGateway
  implements TicketGateway
{
  private readonly timeoutInMs: number

  constructor(timeoutInMs: number, dateProvider: DateProvider) {
    super(dateProvider)
    this.timeoutInMs = timeoutInMs
  }

  override list(): Promise<Array<Ticket>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.list())
      }, this.timeoutInMs)
    })
  }

  override getByUuid(uuid: UUID): Promise<Ticket> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByUuid(uuid))
      }, this.timeoutInMs)
    })
  }

  override getByCustomerUuid(customerUuid: UUID): Promise<Array<Ticket>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByCustomerUuid(customerUuid))
      }, this.timeoutInMs)
    })
  }

  override addReply(ticketUuid: UUID, message: TicketMessage): Promise<Ticket> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.addReply(ticketUuid, message))
      }, this.timeoutInMs)
    })
  }

  override addPrivateNote(
    ticketUuid: UUID,
    note: TicketMessage
  ): Promise<Ticket> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.addPrivateNote(ticketUuid, note))
      }, this.timeoutInMs)
    })
  }

  override updatePriority(
    ticketUuid: UUID,
    priority: TicketPriority
  ): Promise<Ticket> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.updatePriority(ticketUuid, priority))
      }, this.timeoutInMs)
    })
  }

  override resolve(ticketUuid: UUID): Promise<Ticket> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.resolve(ticketUuid))
      }, this.timeoutInMs)
    })
  }
}
