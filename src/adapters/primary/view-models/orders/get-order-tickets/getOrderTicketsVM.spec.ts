import { useTicketStore } from '@store/ticketStore'
import { getOrderTicketsVM } from './getOrderTicketsVM'
import { createPinia, setActivePinia } from 'pinia'
import { newTicket, urgentTicket } from '@utils/testData/tickets'
import { orderToPrepare1 } from '@utils/testData/orders'

describe('Get order tickets view model', () => {
  let ticketStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
  })

  it('should return empty tickets array when no tickets for order', () => {
    const vm = getOrderTicketsVM(orderToPrepare1.uuid)

    expect(vm.tickets).toStrictEqual([])
  })

  it('should return tickets sorted by creation date most recent first', () => {
    ticketStore.setOrderTickets(orderToPrepare1.uuid, [newTicket, urgentTicket])

    const vm = getOrderTicketsVM(orderToPrepare1.uuid)

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
        uuid: urgentTicket.uuid,
        ticketNumber: urgentTicket.ticketNumber,
        subject: urgentTicket.subject,
        status: urgentTicket.status,
        priority: urgentTicket.priority,
        createdAt: urgentTicket.createdAt,
        updatedAt: urgentTicket.updatedAt,
        firstMessageContent: urgentTicket.messages[0].content
      }
    ])
  })

  it('should reflect loading state when store is loading', () => {
    ticketStore.startLoading()

    const vm = getOrderTicketsVM(orderToPrepare1.uuid)

    expect(vm.isLoading).toBe(true)
  })

  it('should reflect not loading state when store is not loading', () => {
    const vm = getOrderTicketsVM(orderToPrepare1.uuid)

    expect(vm.isLoading).toBe(false)
  })
})
