import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { Ticket } from '@core/entities/ticket'
import { getOrderTickets } from '@core/usecases/support/getOrderTickets'
import { useTicketStore } from '@store/ticketStore'
import {
  orderToPrepare1,
  orderToPrepare2,
  orderToPrepare3
} from '@utils/testData/orders'
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

describe('Get order tickets', () => {
  let ticketStore: any
  let ticketGateway: InMemoryTicketGateway
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    ticketGateway = new InMemoryTicketGateway(dateProvider)
  })

  describe('Given there are no tickets for this order', () => {
    it('should list nothing', async () => {
      await whenGetOrderTickets(orderToPrepare1.uuid)
      expect(ticketStore.getOrderTickets(orderToPrepare1.uuid)).toStrictEqual(
        []
      )
    })
  })

  describe('Given there are tickets for different orders', () => {
    beforeEach(() => {
      givenExistingTickets(...allTickets)
    })

    it('should list only tickets for order 1', async () => {
      await whenGetOrderTickets(orderToPrepare1.uuid)
      const orderTickets = [newTicket]
      expect(ticketStore.getOrderTickets(orderToPrepare1.uuid)).toStrictEqual(
        orderTickets
      )
    })

    it('should list only tickets for order 2', async () => {
      await whenGetOrderTickets(orderToPrepare2.uuid)
      const orderTickets = [startedTicket]
      expect(ticketStore.getOrderTickets(orderToPrepare2.uuid)).toStrictEqual(
        orderTickets
      )
    })

    it('should list only tickets for order 3', async () => {
      await whenGetOrderTickets(orderToPrepare3.uuid)
      const orderTickets = [urgentTicket]
      expect(ticketStore.getOrderTickets(orderToPrepare3.uuid)).toStrictEqual(
        orderTickets
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
      await whenGetOrderTickets(orderToPrepare1.uuid)
      expect(isLoadingDuringOperation).toBe(true)
    })

    it('should complete loading after operation', async () => {
      await whenGetOrderTickets(orderToPrepare1.uuid)
      expect(ticketStore.isLoading).toBe(false)
    })
  })

  const givenExistingTickets = (...tickets: Array<Ticket>) => {
    ticketGateway.feedWith(...tickets)
  }

  const whenGetOrderTickets = async (orderUuid: string) => {
    await getOrderTickets(orderUuid, ticketGateway)
  }
})
