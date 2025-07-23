import {
  Ticket,
  TicketMessage,
  TicketPriority,
  TicketStatus
} from '@core/entities/ticket'
import { UUID } from '@core/types/types'
import { TicketDoesNotExistsError } from '@core/errors/TicketDoesNotExistsError'
import { TicketGateway } from '@core/gateways/ticketGateway'
import { DateProvider } from '@core/gateways/dateProvider'
import { UuidGenerator } from '@core/gateways/uuidGenerator'

export class InMemoryTicketGateway implements TicketGateway {
  private tickets: Array<Ticket> = []
  private ticketCounter = 1

  constructor(
    private dateProvider: DateProvider,
    private uuidGenerator?: UuidGenerator
  ) {}

  list(): Promise<Array<Ticket>> {
    const res = this.tickets.slice()
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  getByUuid(uuid: UUID): Promise<Ticket> {
    const res = this.tickets.find((t) => t.uuid === uuid)
    if (!res) throw new TicketDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  getByCustomerUuid(customerUuid: UUID): Promise<Array<Ticket>> {
    const res = this.tickets.filter((t) => t.customer.uuid === customerUuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  getByOrderUuid(orderUuid: UUID): Promise<Array<Ticket>> {
    const res = this.tickets.filter((t) => t.orderUuid === orderUuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  addReply(ticketUuid: UUID, message: TicketMessage): Promise<Ticket> {
    const ticketIndex = this.tickets.findIndex((t) => t.uuid === ticketUuid)
    if (ticketIndex < 0) throw new TicketDoesNotExistsError(ticketUuid)

    const ticket = this.tickets[ticketIndex]
    const updatedTicket = {
      ...ticket,
      messages: [...ticket.messages, message],
      status:
        ticket.status === TicketStatus.NEW
          ? TicketStatus.STARTED
          : ticket.status,
      updatedAt: this.dateProvider.now()
    }

    this.tickets[ticketIndex] = updatedTicket
    return Promise.resolve(JSON.parse(JSON.stringify(updatedTicket)))
  }

  addPrivateNote(ticketUuid: UUID, note: TicketMessage): Promise<Ticket> {
    const ticketIndex = this.tickets.findIndex((t) => t.uuid === ticketUuid)
    if (ticketIndex < 0) throw new TicketDoesNotExistsError(ticketUuid)

    const ticket = this.tickets[ticketIndex]
    const updatedTicket = {
      ...ticket,
      messages: [...ticket.messages, note],
      status:
        ticket.status === TicketStatus.NEW
          ? TicketStatus.STARTED
          : ticket.status,
      updatedAt: this.dateProvider.now()
    }

    this.tickets[ticketIndex] = updatedTicket
    return Promise.resolve(JSON.parse(JSON.stringify(updatedTicket)))
  }

  updatePriority(ticketUuid: UUID, priority: TicketPriority): Promise<Ticket> {
    const ticketIndex = this.tickets.findIndex((t) => t.uuid === ticketUuid)
    if (ticketIndex < 0) throw new TicketDoesNotExistsError(ticketUuid)

    const ticket = this.tickets[ticketIndex]
    const updatedTicket = {
      ...ticket,
      priority,
      status:
        ticket.status === TicketStatus.NEW
          ? TicketStatus.STARTED
          : ticket.status,
      updatedAt: this.dateProvider.now()
    }

    this.tickets[ticketIndex] = updatedTicket
    return Promise.resolve(JSON.parse(JSON.stringify(updatedTicket)))
  }

  resolve(ticketUuid: UUID): Promise<Ticket> {
    const ticketIndex = this.tickets.findIndex((t) => t.uuid === ticketUuid)
    if (ticketIndex < 0) throw new TicketDoesNotExistsError(ticketUuid)

    const ticket = this.tickets[ticketIndex]
    const updatedTicket = {
      ...ticket,
      status: TicketStatus.RESOLVED,
      updatedAt: this.dateProvider.now()
    }

    this.tickets[ticketIndex] = updatedTicket
    return Promise.resolve(JSON.parse(JSON.stringify(updatedTicket)))
  }

  feedWith(...tickets: Array<Ticket>): void {
    this.tickets = tickets
    this.ticketCounter = tickets.length + 1
  }

  generateTicketNumber(): string {
    const year = new Date().getFullYear()
    const number = this.ticketCounter.toString().padStart(4, '0')
    this.ticketCounter++
    return `TICKET_${year}_${number}`
  }
}
