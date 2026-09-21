import {
  GetSupportTicketsVM,
  getSupportTicketsVM,
  KanbanColumnWithKey
} from '@adapters/primary/view-models/support/get-support-tickets/getSupportTicketsVM'
import { useTicketStore } from '@store/ticketStore'
import { timestampToLocaleString } from '@utils/formatters'
import {
  lowPriorityTicket,
  newTicket,
  notWaitingForAnswerTicket,
  resolvedTicket,
  startedTicket,
  ticketFromCustomerWithFirstnameOnly,
  ticketFromCustomerWithoutName,
  urgentTicket,
  waitingForAnswerTicket
} from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'

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

  describe('Given a ticket from a customer without firstname nor lastname', () => {
    beforeEach(() => {
      ticketStore.setTickets([ticketFromCustomerWithoutName])
    })

    it('should display the customer email', () => {
      expectFirstNewTicketCustomerNameToBe(
        ticketFromCustomerWithoutName.customer.email
      )
    })
  })

  describe('Given a ticket from a customer with a firstname only', () => {
    beforeEach(() => {
      ticketStore.setTickets([ticketFromCustomerWithFirstnameOnly])
    })

    it('should display the firstname', () => {
      expectFirstNewTicketCustomerNameToBe(
        ticketFromCustomerWithFirstnameOnly.customer.firstname!
      )
    })
  })

  describe('Given no filter is applied', () => {
    it('should expose no active filter', () => {
      expect(getSupportTicketsVM().activeFilters).toStrictEqual([])
    })
  })

  describe('Given filters are applied', () => {
    beforeEach(() => {
      ticketStore.setFilters({
        customerQuery: 'durand',
        startDate: newTicket.createdAt,
        endDate: resolvedTicket.createdAt
      })
    })

    it('should expose the applied filters', () => {
      expect(getSupportTicketsVM().currentFilters).toStrictEqual({
        customerQuery: 'durand',
        startDate: newTicket.createdAt,
        endDate: resolvedTicket.createdAt
      })
    })

    it('should expose one removable chip per filter', () => {
      expect(getSupportTicketsVM().activeFilters).toStrictEqual([
        { key: 'customerQuery', label: 'Client : "durand"' },
        {
          key: 'startDate',
          label: `Depuis le ${timestampToLocaleString(newTicket.createdAt, 'fr-FR')}`
        },
        {
          key: 'endDate',
          label: `Jusqu'au ${timestampToLocaleString(resolvedTicket.createdAt, 'fr-FR')}`
        }
      ])
    })
  })

  const expectFirstNewTicketCustomerNameToBe = (customerName: string) => {
    expect(getSupportTicketsVM().columns[0].tickets[0].customerName).toBe(
      customerName
    )
  }

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
      currentFilters: {},
      activeFilters: [],
      isLoading: false
    }
    expect(getSupportTicketsVM()).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})
