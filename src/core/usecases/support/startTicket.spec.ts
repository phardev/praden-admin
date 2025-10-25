import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { Ticket, TicketStatus } from '@core/entities/ticket'
import { TicketDoesNotExistsError } from '@core/errors/TicketDoesNotExistsError'
import { useTicketStore } from '@store/ticketStore'
import { newTicket, startedTicket } from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'
import { startTicket } from './startTicket'

describe('startTicket', () => {
  let dateProvider: FakeDateProvider
  let ticketGateway: InMemoryTicketGateway
  let ticketStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    dateProvider = new FakeDateProvider()
    ticketGateway = new InMemoryTicketGateway(dateProvider)
    ticketStore = useTicketStore()
  })
  describe('when starting a ticket with status NEW', () => {
    let ticket: Ticket
    let expectedStartedTicket: Ticket

    beforeEach(async () => {
      dateProvider.feedWith(1690417000000)
      ticket = {
        ...newTicket,
        status: TicketStatus.NEW
      }
      expectedStartedTicket = {
        ...ticket,
        status: TicketStatus.STARTED,
        updatedAt: 1690417000000
      }
      ticketGateway.feedWith(ticket)

      await startTicket(ticket.uuid, ticketGateway)
    })

    it('should start the ticket in the gateway', async () => {
      expect(await ticketGateway.list()).toStrictEqual([expectedStartedTicket])
    })

    it('should update the ticket in the store', () => {
      expect(ticketStore.getByUuid(ticket.uuid)).toStrictEqual(
        expectedStartedTicket
      )
    })
  })

  describe('when starting a ticket that is already STARTED', () => {
    let ticket: Ticket
    let expectedTicket: Ticket

    beforeEach(async () => {
      dateProvider.feedWith(1690417000000)
      ticket = {
        ...startedTicket,
        status: TicketStatus.STARTED
      }
      expectedTicket = {
        ...ticket,
        status: TicketStatus.STARTED,
        updatedAt: 1690417000000
      }
      ticketGateway.feedWith(ticket)

      await startTicket(ticket.uuid, ticketGateway)
    })

    it('should keep the ticket started in the gateway', async () => {
      expect(await ticketGateway.list()).toStrictEqual([expectedTicket])
    })

    it('should update the ticket in the store', () => {
      expect(ticketStore.getByUuid(ticket.uuid)).toStrictEqual(expectedTicket)
    })
  })

  it('should throw error when ticket does not exist', async () => {
    await expect(
      startTicket('non-existent-ticket', ticketGateway)
    ).rejects.toThrow(TicketDoesNotExistsError)
  })
})
