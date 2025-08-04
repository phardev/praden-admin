import { createPinia, setActivePinia } from 'pinia'
import { useTicketStore } from '@store/ticketStore'
import {
  getSupportTicketsVM,
  GetSupportTicketsVM,
  KanbanColumnWithKey
} from '@adapters/primary/view-models/support/get-support-tickets/getSupportTicketsVM'
import {
  newTicket,
  startedTicket,
  urgentTicket,
  resolvedTicket,
  lowPriorityTicket,
  waitingForAnswerTicket,
  notWaitingForAnswerTicket
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
        waitingForAnswerTicket,
        notWaitingForAnswerTicket
      ])
    })

    it('should organize tickets by display status', () => {
      const expectedColumns: Array<KanbanColumnWithKey> = [
        {
          key: 'new',
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
        {
          key: 'started',
          count: 3,
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
            },
            {
              uuid: notWaitingForAnswerTicket.uuid,
              ticketNumber: notWaitingForAnswerTicket.ticketNumber,
              subject: notWaitingForAnswerTicket.subject,
              customerName: `${notWaitingForAnswerTicket.customer.firstname} ${notWaitingForAnswerTicket.customer.lastname}`,
              priority: notWaitingForAnswerTicket.priority,
              createdAt: notWaitingForAnswerTicket.createdAt,
              firstMessageContent: notWaitingForAnswerTicket.messages[0].content
            }
          ]
        },
        {
          key: 'waiting_for_answer',
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
        {
          key: 'resolved',
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
      ]
      const expectedVM: Partial<GetSupportTicketsVM> = {
        columns: expectedColumns
      }
      expectVMToMatch(expectedVM)
    })
  })

  const expectVMToMatch = (expectedVM: Partial<GetSupportTicketsVM>) => {
    const emptyColumns: Array<KanbanColumnWithKey> = [
      {
        key: 'new',
        count: 0,
        tickets: []
      },
      {
        key: 'started',
        count: 0,
        tickets: []
      },
      {
        key: 'waiting_for_answer',
        count: 0,
        tickets: []
      },
      {
        key: 'resolved',
        count: 0,
        tickets: []
      }
    ]
    const emptyVM: GetSupportTicketsVM = {
      columns: emptyColumns,
      isLoading: false
    }
    expect(getSupportTicketsVM()).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})
