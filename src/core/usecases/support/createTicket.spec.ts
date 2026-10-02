import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTicketGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  PHARMACY_AUTHOR_UUID,
  Ticket,
  TicketCustomer,
  TicketMessageType,
  TicketPriority,
  TicketStatus
} from '@core/entities/ticket'
import {
  CreateTicketDTO,
  createTicket
} from '@core/usecases/support/createTicket'
import { useTicketStore } from '@store/ticketStore'
import { elodieDurand } from '@utils/testData/customers'
import { orderToPrepare1 } from '@utils/testData/orders'
import { newTicket } from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'

describe('Create ticket', () => {
  let ticketStore: ReturnType<typeof useTicketStore>
  let ticketGateway: InMemoryTicketGateway
  let dateProvider: FakeDateProvider
  let uuidGenerator: FakeUuidGenerator

  const now = newTicket.createdAt + 10000
  const createdUuid = 'created-ticket-uuid'
  const customer: TicketCustomer = {
    uuid: elodieDurand.uuid,
    email: elodieDurand.email,
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname
  }
  const dto: CreateTicketDTO = {
    customer,
    subject: 'Produit manquant signalé par téléphone',
    description: 'Le client a appelé : il manque un produit dans son colis.',
    priority: TicketPriority.HIGH,
    attachments: []
  }
  const expectedTicket: Ticket = {
    uuid: createdUuid,
    ticketNumber: `TICKET_${new Date(now).getFullYear()}_0002`,
    subject: dto.subject,
    description: dto.description,
    status: TicketStatus.NEW,
    priority: dto.priority,
    customer,
    messages: [
      {
        uuid: createdUuid,
        content: dto.description,
        type: TicketMessageType.PUBLIC,
        sentAt: now,
        authorUuid: PHARMACY_AUTHOR_UUID,
        attachments: []
      }
    ],
    createdAt: now,
    updatedAt: now
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    ticketStore = useTicketStore()
    dateProvider = new FakeDateProvider()
    uuidGenerator = new FakeUuidGenerator()
    ticketGateway = new InMemoryTicketGateway(dateProvider, uuidGenerator)
    ticketGateway.feedWith(newTicket)
    ticketStore.setTickets([newTicket])
    dateProvider.feedWith(now)
    uuidGenerator.setNext(createdUuid)
  })

  describe('Without order', () => {
    beforeEach(async () => {
      await createTicket(dto, ticketGateway)
    })

    it('should save the ticket with a first message written by the pharmacy', async () => {
      expect(await ticketGateway.list()).toStrictEqual([
        newTicket,
        expectedTicket
      ])
    })

    it('should add the ticket to the store', () => {
      expect(ticketStore.items).toStrictEqual([newTicket, expectedTicket])
    })

    it('should make the created ticket the current one', () => {
      expect(ticketStore.currentTicket).toStrictEqual(expectedTicket)
    })

    it('should stop saving', () => {
      expect(ticketStore.isSaving).toStrictEqual(false)
    })
  })

  describe('With an order', () => {
    it('should link the ticket to the order', async () => {
      await createTicket(
        { ...dto, orderUuid: orderToPrepare1.uuid },
        ticketGateway
      )
      expect(ticketStore.currentTicket).toStrictEqual({
        ...expectedTicket,
        orderUuid: orderToPrepare1.uuid
      })
    })
  })

  describe('The creation fails', () => {
    it('should stop saving', async () => {
      await createTicket(dto, new FailingTicketGateway(dateProvider)).catch(
        () => undefined
      )
      expect(ticketStore.isSaving).toStrictEqual(false)
    })
  })
})

class FailingTicketGateway extends InMemoryTicketGateway {
  override create(): Promise<Ticket> {
    return Promise.reject(new Error('creation failed'))
  }
}
