import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { Ticket } from '@core/entities/ticket'
import { getCustomerTickets } from '@core/usecases/support/getCustomerTickets'
import { useTicketStore } from '@store/ticketStore'
import {
  elodieDurand,
  lucasLefevre,
  marcLeblanc
} from '@utils/testData/customers'
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

describe('Get customer tickets', () => {
  let ticketStore: any
  let ticketGateway: InMemoryTicketGateway
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    ticketGateway = new InMemoryTicketGateway(dateProvider)
  })

  describe('Given there are no tickets for this customer', () => {
    it('should list nothing', async () => {
      await whenGetCustomerTickets(elodieDurand.uuid)
      expect(ticketStore.getCustomerTickets(elodieDurand.uuid)).toStrictEqual(
        []
      )
    })
  })

  describe('Given there are tickets for different customers', () => {
    beforeEach(() => {
      givenExistingTickets(...allTickets)
    })

    it('should list only tickets for Elodie Durand', async () => {
      await whenGetCustomerTickets(elodieDurand.uuid)
      const elodieTickets = [newTicket, lowPriorityTicket]
      expect(ticketStore.getCustomerTickets(elodieDurand.uuid)).toStrictEqual(
        elodieTickets
      )
    })

    it('should list only tickets for Lucas Lefevre', async () => {
      await whenGetCustomerTickets(lucasLefevre.uuid)
      const lucasTickets = [startedTicket]
      expect(ticketStore.getCustomerTickets(lucasLefevre.uuid)).toStrictEqual(
        lucasTickets
      )
    })

    it('should list only tickets for Marc Leblanc', async () => {
      await whenGetCustomerTickets(marcLeblanc.uuid)
      const marcTickets = [waitingForAnswerTicket]
      expect(ticketStore.getCustomerTickets(marcLeblanc.uuid)).toStrictEqual(
        marcTickets
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
      await whenGetCustomerTickets(elodieDurand.uuid)
      expect(isLoadingDuringOperation).toBe(true)
    })

    it('should complete loading after operation', async () => {
      await whenGetCustomerTickets(elodieDurand.uuid)
      expect(ticketStore.isLoading).toBe(false)
    })
  })

  const givenExistingTickets = (...tickets: Array<Ticket>) => {
    ticketGateway.feedWith(...tickets)
  }

  const whenGetCustomerTickets = async (customerUuid: string) => {
    await getCustomerTickets(customerUuid, ticketGateway)
  }
})
