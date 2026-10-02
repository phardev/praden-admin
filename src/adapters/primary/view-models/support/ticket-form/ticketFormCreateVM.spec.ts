import { TicketCustomer, TicketPriority } from '@core/entities/ticket'
import { CreateTicketDTO } from '@core/usecases/support/createTicket'
import { useSearchStore } from '@store/searchStore'
import { useTicketStore } from '@store/ticketStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { orderToPrepare1 } from '@utils/testData/orders'
import { newTicket } from '@utils/testData/tickets'
import { createPinia, setActivePinia } from 'pinia'
import { computeTotalWithTaxForOrder } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import {
  TICKET_CUSTOMER_SEARCH_NAMESPACE,
  TICKET_DESCRIPTION_MAX_LENGTH,
  TICKET_ORDERS_SEARCH_NAMESPACE,
  TICKET_SUBJECT_MAX_LENGTH,
  TicketFormCreateVM,
  ticketFormCreateVM
} from './ticketFormCreateVM'

describe('Ticket form create VM', () => {
  const key = 'support-new'
  let vm: TicketFormCreateVM
  let searchStore: ReturnType<typeof useSearchStore>

  const elodieDurandTicketCustomer: TicketCustomer = {
    uuid: elodieDurand.uuid,
    email: elodieDurand.email,
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname
  }
  const subject = newTicket.subject
  const description = newTicket.description

  beforeEach(() => {
    setActivePinia(createPinia())
    searchStore = useSearchStore()
    searchStore.set(TICKET_CUSTOMER_SEARCH_NAMESPACE, [
      elodieDurand,
      lucasLefevre
    ])
    vm = ticketFormCreateVM(key)
  })

  const givenCustomerIsSelected = () => {
    vm.set('customerUuid', elodieDurand.uuid)
  }

  const givenCustomerOrdersAreLoaded = () => {
    searchStore.set(TICKET_ORDERS_SEARCH_NAMESPACE, [orderToPrepare1])
  }

  const givenFormIsFilled = () => {
    givenCustomerIsSelected()
    vm.set('subject', subject)
    vm.set('description', description)
  }

  describe('Initialization', () => {
    it('should start without customer', () => {
      expect(vm.get('customer')).toStrictEqual({
        value: undefined,
        canEdit: true
      })
    })

    it('should start with a medium priority', () => {
      expect(vm.get('priority')).toStrictEqual({
        value: TicketPriority.MEDIUM,
        canEdit: true
      })
    })

    it('should start without attachments', () => {
      expect(vm.get('attachments')).toStrictEqual({
        value: [],
        canEdit: true
      })
    })
  })

  describe('Customer selection', () => {
    it('should select the customer found by the search', () => {
      givenCustomerIsSelected()
      expect(vm.getCustomer()).toStrictEqual(elodieDurandTicketCustomer)
    })

    it('should not select a customer missing from the search', () => {
      givenCustomerIsSelected()
      vm.set('customerUuid', 'unknown-customer')
      expect(vm.getCustomer()).toBeUndefined()
    })

    it('should forget the order when the customer changes', () => {
      givenCustomerIsSelected()
      vm.set('orderUuid', orderToPrepare1.uuid)
      vm.set('customerUuid', lucasLefevre.uuid)
      expect(vm.get('orderUuid').value).toBeUndefined()
    })

    it('should forget the order when the customer is removed', () => {
      givenCustomerIsSelected()
      vm.set('orderUuid', orderToPrepare1.uuid)
      vm.set('customer', undefined)
      expect(vm.get('orderUuid').value).toBeUndefined()
    })
  })

  describe('Customer orders', () => {
    it('should have no order to choose before they are loaded', () => {
      expect(vm.getAvailableOrders()).toStrictEqual([])
    })

    it('should label each order with its date and total', () => {
      givenCustomerOrdersAreLoaded()
      const date = timestampToLocaleString(orderToPrepare1.createdAt, 'fr-FR')
      const total = priceFormatter('fr-FR', 'EUR').format(
        computeTotalWithTaxForOrder(orderToPrepare1) / 100
      )
      expect(vm.getAvailableOrders()).toStrictEqual([
        { uuid: orderToPrepare1.uuid, label: `${date} · ${total}` }
      ])
    })

    it('should tell when the orders are loading', () => {
      searchStore.startLoading(TICKET_ORDERS_SEARCH_NAMESPACE)
      expect(vm.isLoadingOrders()).toStrictEqual(true)
    })
  })

  describe('Priorities', () => {
    it('should offer every priority from the most to the least urgent', () => {
      expect(vm.getPriorityOptions()).toStrictEqual([
        { value: TicketPriority.URGENT, labelKey: 'support.priority.urgent' },
        { value: TicketPriority.HIGH, labelKey: 'support.priority.high' },
        { value: TicketPriority.MEDIUM, labelKey: 'support.priority.medium' },
        { value: TicketPriority.LOW, labelKey: 'support.priority.low' }
      ])
    })
  })

  describe('Validation', () => {
    it('should explain that a customer, a subject and a description are required', () => {
      expect(vm.getValidationHints()).toStrictEqual([
        'support.create.hints.selectCustomer',
        'support.create.hints.subjectRequired',
        'support.create.hints.descriptionRequired'
      ])
    })

    it('should refuse a blank subject', () => {
      givenFormIsFilled()
      vm.set('subject', '   ')
      expect(vm.getValidationHints()).toStrictEqual([
        'support.create.hints.subjectRequired'
      ])
    })

    it('should refuse a blank description', () => {
      givenFormIsFilled()
      vm.set('description', '   ')
      expect(vm.getValidationHints()).toStrictEqual([
        'support.create.hints.descriptionRequired'
      ])
    })

    it('should refuse a subject over the limit', () => {
      givenFormIsFilled()
      vm.set('subject', 'a'.repeat(TICKET_SUBJECT_MAX_LENGTH + 1))
      expect(vm.getValidationHints()).toStrictEqual([
        'support.create.hints.subjectTooLong'
      ])
    })

    it('should refuse a description over the limit', () => {
      givenFormIsFilled()
      vm.set('description', 'a'.repeat(TICKET_DESCRIPTION_MAX_LENGTH + 1))
      expect(vm.getValidationHints()).toStrictEqual([
        'support.create.hints.descriptionTooLong'
      ])
    })

    it('should not allow to validate an incomplete form', () => {
      expect(vm.getCanValidate()).toStrictEqual(false)
    })

    it('should allow to validate a complete form', () => {
      givenFormIsFilled()
      expect(vm.getCanValidate()).toStrictEqual(true)
    })

    it('should not allow to validate while saving', () => {
      givenFormIsFilled()
      useTicketStore().startSaving()
      expect(vm.getCanValidate()).toStrictEqual(false)
    })
  })

  describe('DTO', () => {
    it('should build the dto without order', () => {
      givenFormIsFilled()
      const expected: CreateTicketDTO = {
        customer: elodieDurandTicketCustomer,
        subject,
        description,
        priority: TicketPriority.MEDIUM,
        attachments: []
      }
      expect(vm.getDto()).toStrictEqual(expected)
    })

    it('should build the dto with the chosen order, priority and attachments', () => {
      const attachment = new File(['photo'], 'photo.png', { type: 'image/png' })
      givenFormIsFilled()
      vm.set('orderUuid', orderToPrepare1.uuid)
      vm.set('priority', TicketPriority.URGENT)
      vm.set('attachments', [attachment])
      const expected: CreateTicketDTO = {
        customer: elodieDurandTicketCustomer,
        subject,
        description,
        priority: TicketPriority.URGENT,
        orderUuid: orderToPrepare1.uuid,
        attachments: [attachment]
      }
      expect(vm.getDto()).toStrictEqual(expected)
    })
  })

  describe('Created ticket', () => {
    it('should have no created ticket before the creation', () => {
      expect(vm.getCreatedTicketUuid()).toBeUndefined()
    })

    it('should give the uuid of the created ticket', () => {
      useTicketStore().setCurrentTicket(newTicket)
      expect(vm.getCreatedTicketUuid()).toStrictEqual(newTicket.uuid)
    })
  })
})
