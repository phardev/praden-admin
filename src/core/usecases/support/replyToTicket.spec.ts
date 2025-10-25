import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Ticket, TicketMessageType, TicketStatus } from '@core/entities/ticket'
import { TicketDoesNotExistsError } from '@core/errors/TicketDoesNotExistsError'
import { Timestamp } from '@core/types/types'
import { replyToTicket } from '@core/usecases/support/replyToTicket'
import { useTicketStore } from '@store/ticketStore'
import { newTicket } from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'

describe('Reply to ticket', () => {
  let ticketStore: any
  let ticketGateway: InMemoryTicketGateway
  let dateProvider: FakeDateProvider
  let uuidGenerator: FakeUuidGenerator
  let now: Timestamp

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    uuidGenerator = new FakeUuidGenerator()
    ticketGateway = new InMemoryTicketGateway(dateProvider, uuidGenerator)
  })

  describe('Given the ticket exists', () => {
    beforeEach(() => {
      givenExistingTickets(newTicket)
      givenNowIs(newTicket.createdAt + 10000)
    })

    it('should add the reply message', async () => {
      await whenReplyToTicket(newTicket.uuid, 'Merci pour votre message')
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        updatedAt: now,
        messages: [
          ...newTicket.messages,
          {
            uuid: 'reply-message-uuid',
            content: 'Merci pour votre message',
            type: TicketMessageType.PUBLIC,
            authorName: 'Service Client',
            sentAt: now,
            attachments: []
          }
        ]
      }
      expect(await ticketGateway.list()).toStrictEqual([expectedTicket])
    })

    it('should update ticket status to STARTED when replying to NEW ticket', async () => {
      await whenReplyToTicket(newTicket.uuid, 'Merci pour votre message')
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        updatedAt: now,
        messages: [
          ...newTicket.messages,
          {
            uuid: 'reply-message-uuid',
            content: 'Merci pour votre message',
            type: TicketMessageType.PUBLIC,
            authorName: 'Service Client',
            sentAt: now,
            attachments: []
          }
        ]
      }
      expect(ticketStore.getByUuid(newTicket.uuid)).toStrictEqual(
        expectedTicket
      )
    })

    it('should update the ticket in the store', async () => {
      await whenReplyToTicket(newTicket.uuid, 'Merci pour votre message')
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        updatedAt: now,
        messages: [
          ...newTicket.messages,
          {
            uuid: 'reply-message-uuid',
            content: 'Merci pour votre message',
            type: TicketMessageType.PUBLIC,
            authorName: 'Service Client',
            sentAt: now,
            attachments: []
          }
        ]
      }
      expect(ticketStore.getByUuid(newTicket.uuid)).toStrictEqual(
        expectedTicket
      )
    })

    it('should handle file attachments when replying', async () => {
      const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain'
      })
      await whenReplyToTicketWithAttachments(
        newTicket.uuid,
        'Voir fichier joint',
        [mockFile]
      )
      const ticket = await ticketGateway.getByUuid(newTicket.uuid)
      const lastMessage = ticket.messages[ticket.messages.length - 1]

      expect(lastMessage.attachments).toStrictEqual([
        {
          filename: 'test.txt',
          mimeType: 'text/plain',
          size: 12,
          url: expect.stringMatching(/^data:text\/plain;base64,/)
        }
      ])
    })
  })

  describe('Given the ticket does not exist', () => {
    it('should throw an error', async () => {
      await expect(
        whenReplyToTicket('non-existent-uuid', 'Some reply')
      ).rejects.toThrow(TicketDoesNotExistsError)
    })
  })

  const givenExistingTickets = (...tickets: any[]) => {
    ticketGateway.feedWith(...tickets)
    ticketStore.setTickets(tickets)
  }

  const givenNowIs = (givenNow: Timestamp) => {
    now = givenNow
    dateProvider.feedWith(now)
  }

  const whenReplyToTicket = async (ticketUuid: string, content: string) => {
    uuidGenerator.setNext('reply-message-uuid')
    await replyToTicket(ticketUuid, content, 'Service Client', ticketGateway)
  }

  const whenReplyToTicketWithAttachments = async (
    ticketUuid: string,
    content: string,
    attachments: Array<File>
  ) => {
    uuidGenerator.setNext('reply-message-uuid')
    await replyToTicket(
      ticketUuid,
      content,
      'Service Client',
      ticketGateway,
      attachments
    )
  }
})
