import { useTicketStore } from '@store/ticketStore'
import { getTicketDetails } from '@core/usecases/support/getTicketDetails'
import { createPinia, setActivePinia } from 'pinia'
import { startedTicket } from '@utils/testData/tickets'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { TicketDoesNotExistsError } from '@core/errors/TicketDoesNotExistsError'

describe('Get ticket details', () => {
  let ticketStore: any
  let ticketGateway: InMemoryTicketGateway
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    ticketGateway = new InMemoryTicketGateway(dateProvider)
  })

  describe('Given the ticket exists', () => {
    beforeEach(() => {
      givenExistingTickets(startedTicket)
    })

    it('should return the ticket details', async () => {
      await whenGetTicketDetails(startedTicket.uuid)
      expect(ticketStore.currentTicket).toStrictEqual(startedTicket)
    })
  })

  describe('Given the ticket does not exist', () => {
    it('should throw an error', async () => {
      await expect(whenGetTicketDetails('non-existent-uuid')).rejects.toThrow(
        TicketDoesNotExistsError
      )
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenExistingTickets(startedTicket)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = ticketStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenGetTicketDetails(startedTicket.uuid)
    })
    it('should be aware that loading is over', async () => {
      await whenGetTicketDetails(startedTicket.uuid)
      expect(ticketStore.isLoading).toBe(false)
    })
  })

  const givenExistingTickets = (...tickets: any[]) => {
    ticketGateway.feedWith(...tickets)
  }

  const whenGetTicketDetails = async (uuid: string) => {
    await getTicketDetails(uuid, ticketGateway)
  }
})
