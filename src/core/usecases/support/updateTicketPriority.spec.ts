import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { Ticket, TicketPriority, TicketStatus } from '@core/entities/ticket'
import { TicketDoesNotExistsError } from '@core/errors/TicketDoesNotExistsError'
import { Timestamp } from '@core/types/types'
import { updateTicketPriority } from '@core/usecases/support/updateTicketPriority'
import { useTicketStore } from '@store/ticketStore'
import { newTicket } from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'

describe('Update ticket priority', () => {
  let ticketStore: any
  let ticketGateway: InMemoryTicketGateway
  let dateProvider: FakeDateProvider
  let now: Timestamp

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    ticketGateway = new InMemoryTicketGateway(dateProvider)
    ticketStore.items = [newTicket]
  })

  describe('Given the ticket exists', () => {
    beforeEach(() => {
      givenExistingTickets(newTicket)
      givenNowIs(newTicket.createdAt + 10000)
    })

    it('should update the ticket priority', async () => {
      await whenUpdateTicketPriority(newTicket.uuid, TicketPriority.URGENT)
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        priority: TicketPriority.URGENT,
        updatedAt: now
      }
      expect(await ticketGateway.list()).toStrictEqual([expectedTicket])
    })

    it('should update ticket status to STARTED when updating priority of NEW ticket', async () => {
      await whenUpdateTicketPriority(newTicket.uuid, TicketPriority.HIGH)
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        priority: TicketPriority.HIGH,
        updatedAt: now
      }
      expect(await ticketGateway.list()).toStrictEqual([expectedTicket])
    })

    it('should update the ticket in the store', async () => {
      await whenUpdateTicketPriority(newTicket.uuid, TicketPriority.LOW)
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        priority: TicketPriority.LOW,
        updatedAt: now
      }
      expect(ticketStore.getByUuid(newTicket.uuid)).toStrictEqual(
        expectedTicket
      )
    })

    it('should update currentTicket when it matches the updated ticket', async () => {
      ticketStore.setCurrentTicket(newTicket)

      await whenUpdateTicketPriority(newTicket.uuid, TicketPriority.URGENT)
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        priority: TicketPriority.URGENT,
        updatedAt: now
      }
      expect(ticketStore.currentTicket).toStrictEqual(expectedTicket)
    })
  })

  describe('Given the ticket does not exist', () => {
    it('should throw an error', async () => {
      await expect(
        whenUpdateTicketPriority('non-existent-uuid', TicketPriority.HIGH)
      ).rejects.toThrow(TicketDoesNotExistsError)
    })
  })

  const givenNowIs = (givenNow: Timestamp) => {
    now = givenNow
    dateProvider.feedWith(now)
  }

  const givenExistingTickets = (...tickets: any[]) => {
    ticketGateway.feedWith(...tickets)
    ticketStore.setTickets(tickets)
  }

  const whenUpdateTicketPriority = async (
    ticketUuid: string,
    priority: TicketPriority
  ) => {
    await updateTicketPriority(ticketUuid, priority, ticketGateway)
  }
})
