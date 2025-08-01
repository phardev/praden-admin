import { useTicketStore } from '@store/ticketStore'
import { getCustomerTicketsVM } from './getCustomerTicketsVM'
import { createPinia, setActivePinia } from 'pinia'
import { newTicket, lowPriorityTicket } from '@utils/testData/tickets'
import { elodieDurand } from '@utils/testData/customers'

describe('Get customer tickets view model', () => {
  let ticketStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
  })

  it('should return empty tickets array when no tickets for customer', () => {
    const vm = getCustomerTicketsVM(elodieDurand.uuid)

    expect(vm.tickets).toStrictEqual([])
  })

  it('should return tickets sorted by creation date most recent first', () => {
    ticketStore.setCustomerTickets(elodieDurand.uuid, [
      newTicket,
      lowPriorityTicket
    ])

    const vm = getCustomerTicketsVM(elodieDurand.uuid)

    expect(vm.tickets).toStrictEqual([
      {
        uuid: newTicket.uuid,
        ticketNumber: newTicket.ticketNumber,
        subject: newTicket.subject,
        status: newTicket.status,
        priority: newTicket.priority,
        createdAt: newTicket.createdAt,
        updatedAt: newTicket.updatedAt,
        firstMessageContent: newTicket.messages[0].content
      },
      {
        uuid: lowPriorityTicket.uuid,
        ticketNumber: lowPriorityTicket.ticketNumber,
        subject: lowPriorityTicket.subject,
        status: lowPriorityTicket.status,
        priority: lowPriorityTicket.priority,
        createdAt: lowPriorityTicket.createdAt,
        updatedAt: lowPriorityTicket.updatedAt,
        firstMessageContent: lowPriorityTicket.messages[0].content
      }
    ])
  })

  it('should reflect loading state when store is loading', () => {
    ticketStore.startLoading()

    const vm = getCustomerTicketsVM(elodieDurand.uuid)

    expect(vm.isLoading).toBe(true)
  })

  it('should reflect not loading state when store is not loading', () => {
    const vm = getCustomerTicketsVM(elodieDurand.uuid)

    expect(vm.isLoading).toBe(false)
  })
})
