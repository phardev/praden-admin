import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Ticket, TicketMessageType, TicketStatus } from '@core/entities/ticket'
import { TicketDoesNotExistsError } from '@core/errors/TicketDoesNotExistsError'
import { Timestamp } from '@core/types/types'
import { addPrivateNoteToTicket } from '@core/usecases/support/addPrivateNoteToTicket'
import { useTicketStore } from '@store/ticketStore'
import { newTicket } from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'

describe('Add private note to ticket', () => {
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

    it('should add the private note', async () => {
      await whenAddPrivateNote(newTicket.uuid, "Note privée pour l'équipe")
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        updatedAt: now,
        messages: [
          ...newTicket.messages,
          {
            uuid: 'private-note-uuid',
            content: "Note privée pour l'équipe",
            type: TicketMessageType.PRIVATE,
            authorUuid: 'support-operator-uuid',
            sentAt: now,
            attachments: []
          }
        ]
      }
      expect(await ticketGateway.list()).toStrictEqual([expectedTicket])
    })

    it('should update ticket status to STARTED when adding note to NEW ticket', async () => {
      await whenAddPrivateNote(newTicket.uuid, 'Note privée')
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        updatedAt: now,
        messages: [
          ...newTicket.messages,
          {
            uuid: 'private-note-uuid',
            content: 'Note privée',
            type: TicketMessageType.PRIVATE,
            authorUuid: 'support-operator-uuid',
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
      await whenAddPrivateNote(newTicket.uuid, 'Note privée')
      const expectedTicket: Ticket = {
        ...newTicket,
        status: TicketStatus.STARTED,
        updatedAt: now,
        messages: [
          ...newTicket.messages,
          {
            uuid: 'private-note-uuid',
            content: 'Note privée',
            type: TicketMessageType.PRIVATE,
            authorUuid: 'support-operator-uuid',
            sentAt: now,
            attachments: []
          }
        ]
      }
      expect(ticketStore.getByUuid(newTicket.uuid)).toStrictEqual(
        expectedTicket
      )
    })
  })

  describe('Given the ticket does not exist', () => {
    it('should throw an error', async () => {
      await expect(
        whenAddPrivateNote('non-existent-uuid', 'Some note')
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

  const whenAddPrivateNote = async (ticketUuid: string, content: string) => {
    uuidGenerator.setNext('private-note-uuid')
    await addPrivateNoteToTicket(
      ticketUuid,
      content,
      'Opérateur Support',
      ticketGateway
    )
  }
})
