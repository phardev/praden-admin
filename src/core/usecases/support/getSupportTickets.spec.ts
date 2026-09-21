import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { Ticket } from '@core/entities/ticket'
import {
  getSupportTickets,
  SupportTicketsFilters
} from '@core/usecases/support/getSupportTickets'
import { useTicketStore } from '@store/ticketStore'
import {
  lowPriorityTicket,
  newTicket,
  resolvedTicket,
  startedTicket,
  ticketFromCustomerWithoutName,
  urgentTicket,
  waitingForAnswerTicket
} from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'

const allTickets = [
  newTicket,
  startedTicket,
  urgentTicket,
  resolvedTicket,
  lowPriorityTicket,
  waitingForAnswerTicket
]

describe('Get support tickets', () => {
  let ticketStore: any
  let ticketGateway: InMemoryTicketGateway
  let dateProvider: FakeDateProvider
  let filters: SupportTicketsFilters

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    ticketGateway = new InMemoryTicketGateway(dateProvider)
    filters = {}
  })

  describe('Given there are no tickets', () => {
    it('should list nothing', async () => {
      await whenGetSupportTickets()
      expect(ticketStore.items).toStrictEqual([])
    })
  })

  describe('Given there are some tickets', () => {
    beforeEach(async () => {
      givenExistingTickets(...allTickets)
      await whenGetSupportTickets()
    })

    it('should list all of them', () => {
      expect(ticketStore.items).toStrictEqual(allTickets)
    })
  })

  describe('Given a customer filter', () => {
    beforeEach(async () => {
      givenExistingTickets(...allTickets, ticketFromCustomerWithoutName)
      filters = { customerQuery: ticketFromCustomerWithoutName.customer.email }
      await whenGetSupportTickets()
    })

    it('should list the matching tickets only', () => {
      expect(ticketStore.items).toStrictEqual([ticketFromCustomerWithoutName])
    })

    it('should keep the applied filters', () => {
      expect(ticketStore.filters).toStrictEqual(filters)
    })
  })

  describe('Given a date range filter', () => {
    beforeEach(async () => {
      givenExistingTickets(...allTickets)
      filters = {
        startDate: newTicket.createdAt,
        endDate: newTicket.createdAt
      }
      await whenGetSupportTickets()
    })

    it('should list the tickets created inside the range', () => {
      expect(ticketStore.items).toStrictEqual(
        allTickets.filter((ticket) => ticket.createdAt === newTicket.createdAt)
      )
    })
  })

  describe('Loading', () => {
    it('should set loading state during operation', async () => {
      let isLoadingDuringOperation = false
      const unsubscribe = ticketStore.$subscribe(
        (_mutation: any, state: any) => {
          if (state.isLoading) {
            isLoadingDuringOperation = true
          }
          unsubscribe()
        }
      )
      await whenGetSupportTickets()
      expect(isLoadingDuringOperation).toBe(true)
    })
    it('should complete loading after operation', async () => {
      await whenGetSupportTickets()
      expect(ticketStore.isLoading).toBe(false)
    })
  })

  const givenExistingTickets = (...tickets: Array<Ticket>) => {
    ticketGateway.feedWith(...tickets)
  }

  const whenGetSupportTickets = async () => {
    await getSupportTickets(ticketGateway, filters)
  }
})
