import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { Ticket, TicketStatus } from '@core/entities/ticket'
import { TicketDoesNotExistsError } from '@core/errors/TicketDoesNotExistsError'
import { Timestamp } from '@core/types/types'
import { resolveTicket } from '@core/usecases/support/resolveTicket'
import { useTicketStore } from '@store/ticketStore'
import { startedTicket } from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'

describe('Resolve ticket', () => {
  let ticketStore: any
  let ticketGateway: InMemoryTicketGateway
  let dateProvider: FakeDateProvider
  let now: Timestamp

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    ticketGateway = new InMemoryTicketGateway(dateProvider)
  })

  describe('Given the ticket exists', () => {
    beforeEach(() => {
      givenExistingTickets(startedTicket)
      givenNowIs(startedTicket.createdAt + 10000)
    })

    it('should mark the ticket as resolved', async () => {
      await whenResolveTicket(startedTicket.uuid)
      const expectedTicket: Ticket = {
        ...startedTicket,
        status: TicketStatus.RESOLVED,
        updatedAt: now
      }
      expect(await ticketGateway.list()).toStrictEqual([expectedTicket])
    })

    it('should update the ticket in the store', async () => {
      await whenResolveTicket(startedTicket.uuid)
      const expectedTicket: Ticket = {
        ...startedTicket,
        status: TicketStatus.RESOLVED,
        updatedAt: now
      }
      expect(ticketStore.getByUuid(startedTicket.uuid)).toStrictEqual(
        expectedTicket
      )
    })
  })

  describe('Given the ticket does not exist', () => {
    it('should throw an error', async () => {
      await expect(whenResolveTicket('non-existent-uuid')).rejects.toThrow(
        TicketDoesNotExistsError
      )
    })
  })

  const givenExistingTickets = (...tickets: any[]) => {
    ticketGateway.feedWith(...tickets)
    ticketStore.setTickets(tickets)
  }

  const givenNowIs = (givenNow: Timestamp) => {
    now = givenNow
    dateProvider.feedWith(now)
  }

  const whenResolveTicket = async (ticketUuid: string) => {
    await resolveTicket(ticketUuid, ticketGateway)
  }
})
