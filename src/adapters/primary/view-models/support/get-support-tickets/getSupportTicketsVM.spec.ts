import { createPinia, setActivePinia } from 'pinia'
import { useTicketStore } from '@store/ticketStore'
import {
  getSupportTicketsVM,
  GetSupportTicketsVM
} from '@adapters/primary/view-models/support/get-support-tickets/getSupportTicketsVM'
import {
  newTicket,
  startedTicket,
  urgentTicket,
  resolvedTicket,
  lowPriorityTicket,
  waitingForAnswerTicket
} from '@utils/testData/tickets'

describe('Get support tickets VM', () => {
  let ticketStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
  })

  describe('Given there are no tickets', () => {
    it('should return empty kanban columns', () => {
      expectVMToMatch({})
    })

    it('should not be loading', () => {
      expectVMToMatch({ isLoading: false })
    })
  })

  describe('Given there are tickets', () => {
    beforeEach(() => {
      ticketStore.setTickets([
        newTicket,
        startedTicket,
        urgentTicket,
        resolvedTicket,
        lowPriorityTicket,
        waitingForAnswerTicket
      ])
    })

    it('should organize tickets by display status', () => {
      const expectedVM: Partial<GetSupportTicketsVM> = {
        columns: {
          new: {
            count: 2,
            tickets: [
              {
                uuid: newTicket.uuid,
                ticketNumber: newTicket.ticketNumber,
                subject: newTicket.subject,
                customerName: `${newTicket.customer.firstname} ${newTicket.customer.lastname}`,
                priority: newTicket.priority,
                createdAt: newTicket.createdAt,
                firstMessageContent: newTicket.messages[0].content
              },
              {
                uuid: lowPriorityTicket.uuid,
                ticketNumber: lowPriorityTicket.ticketNumber,
                subject: lowPriorityTicket.subject,
                customerName: `${lowPriorityTicket.customer.firstname} ${lowPriorityTicket.customer.lastname}`,
                priority: lowPriorityTicket.priority,
                createdAt: lowPriorityTicket.createdAt,
                firstMessageContent: lowPriorityTicket.messages[0].content
              }
            ]
          },
          started: {
            count: 2,
            tickets: [
              {
                uuid: urgentTicket.uuid,
                ticketNumber: urgentTicket.ticketNumber,
                subject: urgentTicket.subject,
                customerName: `${urgentTicket.customer.firstname} ${urgentTicket.customer.lastname}`,
                priority: urgentTicket.priority,
                createdAt: urgentTicket.createdAt,
                firstMessageContent: urgentTicket.messages[0].content
              },
              {
                uuid: startedTicket.uuid,
                ticketNumber: startedTicket.ticketNumber,
                subject: startedTicket.subject,
                customerName: `${startedTicket.customer.firstname} ${startedTicket.customer.lastname}`,
                priority: startedTicket.priority,
                createdAt: startedTicket.createdAt,
                firstMessageContent: startedTicket.messages[0].content
              }
            ]
          },
          waiting_for_answer: {
            count: 1,
            tickets: [
              {
                uuid: waitingForAnswerTicket.uuid,
                ticketNumber: waitingForAnswerTicket.ticketNumber,
                subject: waitingForAnswerTicket.subject,
                customerName: `${waitingForAnswerTicket.customer.firstname} ${waitingForAnswerTicket.customer.lastname}`,
                priority: waitingForAnswerTicket.priority,
                createdAt: waitingForAnswerTicket.createdAt,
                firstMessageContent: waitingForAnswerTicket.messages[0].content
              }
            ]
          },
          resolved: {
            count: 1,
            tickets: [
              {
                uuid: resolvedTicket.uuid,
                ticketNumber: resolvedTicket.ticketNumber,
                subject: resolvedTicket.subject,
                customerName: `${resolvedTicket.customer.firstname} ${resolvedTicket.customer.lastname}`,
                priority: resolvedTicket.priority,
                createdAt: resolvedTicket.createdAt,
                firstMessageContent: resolvedTicket.messages[0].content
              }
            ]
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
  })

  const expectVMToMatch = (expectedVM: Partial<GetSupportTicketsVM>) => {
    const emptyVM: GetSupportTicketsVM = {
      columns: {
        new: {
          count: 0,
          tickets: []
        },
        started: {
          count: 0,
          tickets: []
        },
        waiting_for_answer: {
          count: 0,
          tickets: []
        },
        resolved: {
          count: 0,
          tickets: []
        }
      },
      isLoading: false
    }
    expect(getSupportTicketsVM()).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})
