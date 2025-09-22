import { createPinia, setActivePinia } from 'pinia'
import { useTicketStore } from '@store/ticketStore'
import {
  getTicketDetailsVM,
  TicketDetailsVM,
  TicketMessageVM
} from '@adapters/primary/view-models/support/get-support-ticket-details/getTicketDetailsVM'
import { startedTicket } from '@utils/testData/tickets'
import { TicketMessageType } from '@core/entities/ticket'

describe('Get ticket details VM', () => {
  let ticketStore: ReturnType<typeof useTicketStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
  })

  describe('Given there is no current ticket', () => {
    it('should return undefined', () => {
      ticketStore.isLoading = true
      const vm = getTicketDetailsVM()
      expect(vm).toStrictEqual({
        item: undefined,
        isLoading: true
      })
    })
  })

  describe('Given there is a current ticket', () => {
    beforeEach(() => {
      ticketStore.setCurrentTicket(startedTicket)
    })

    it('should return ticket details', () => {
      const vm = getTicketDetailsVM()
      const customerName = `${startedTicket.customer.firstname} ${startedTicket.customer.lastname}`

      const expectedMessages: TicketMessageVM[] = startedTicket.messages.map(
        (message) => ({
          uuid: message.uuid,
          content: message.content,
          type: message.type,
          sentAt: message.sentAt,
          author: {
            uuid: message.authorUuid,
            name:
              message.authorUuid === startedTicket.customer.uuid
                ? customerName
                : 'Service Client'
          },
          attachments: message.attachments
        })
      )

      const expectedVM: TicketDetailsVM = {
        uuid: startedTicket.uuid,
        ticketNumber: startedTicket.ticketNumber,
        subject: startedTicket.subject,
        description: startedTicket.description,
        status: startedTicket.status,
        priority: startedTicket.priority,
        customer: {
          uuid: startedTicket.customer.uuid,
          email: startedTicket.customer.email,
          name: customerName
        },
        messages: expectedMessages,
        createdAt: startedTicket.createdAt,
        updatedAt: startedTicket.updatedAt,
        orderUuid: startedTicket.orderUuid
      }
      expect(vm.item).toStrictEqual(expectedVM)
    })

    it('should format messages for display', () => {
      const vm = getTicketDetailsVM()
      const customerName = `${startedTicket.customer.firstname} ${startedTicket.customer.lastname}`

      const expectedMessages: TicketMessageVM[] = startedTicket.messages.map(
        (message) => ({
          uuid: message.uuid,
          content: message.content,
          type: message.type,
          sentAt: message.sentAt,
          author: {
            uuid: message.authorUuid,
            name:
              message.authorUuid === startedTicket.customer.uuid
                ? customerName
                : 'Service Client'
          },
          attachments: message.attachments
        })
      )

      expect(vm?.item?.messages).toStrictEqual(expectedMessages)
    })

    it('should separate public and private messages', () => {
      const vm = getTicketDetailsVM()
      const publicMessages = vm?.item?.messages.filter(
        (m) => m.type === TicketMessageType.PUBLIC
      )
      const privateMessages = vm?.item?.messages.filter(
        (m) => m.type === TicketMessageType.PRIVATE
      )
      const expectedCounts = {
        publicMessages: 3,
        privateMessages: 1
      }
      expect({
        publicMessages: publicMessages?.length,
        privateMessages: privateMessages?.length
      }).toStrictEqual(expectedCounts)
    })

    it('should format dates', () => {
      const vm = getTicketDetailsVM()
      const expectedDates = {
        createdAt: startedTicket.createdAt,
        updatedAt: startedTicket.updatedAt
      }
      expect({
        createdAt: vm?.item?.createdAt,
        updatedAt: vm?.item?.updatedAt
      }).toStrictEqual(expectedDates)
    })

    it('should indicate if not loading', () => {
      const vm = getTicketDetailsVM()
      expect(vm?.isLoading).toBe(false)
    })
  })
})
