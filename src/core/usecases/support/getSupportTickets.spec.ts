import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { Ticket } from '@core/entities/ticket'
import { getSupportTickets } from '@core/usecases/support/getSupportTickets'
import { useTicketStore } from '@store/ticketStore'
import {
  lowPriorityTicket,
  newTicket,
  resolvedTicket,
  startedTicket,
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

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    ticketGateway = new InMemoryTicketGateway(dateProvider)
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
    await getSupportTickets(ticketGateway)
  }
})
