import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { Customer } from '@core/entities/customer'
import { Order } from '@core/entities/order'
import { TicketCustomer, TicketPriority } from '@core/entities/ticket'
import { UUID } from '@core/types/types'
import { CreateTicketDTO } from '@core/usecases/support/createTicket'
import { useFormStore } from '@store/formStore'
import { useSearchStore } from '@store/searchStore'
import { useTicketStore } from '@store/ticketStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { computeTotalWithTaxForOrder } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { Field } from '../../promotions/promotion-form/promotionFormCreateVM'

export const TICKET_CUSTOMER_SEARCH_NAMESPACE = 'ticket-create-customer'
export const TICKET_ORDERS_SEARCH_NAMESPACE = 'ticket-create-orders'
export const TICKET_SUBJECT_MAX_LENGTH = 200
export const TICKET_DESCRIPTION_MAX_LENGTH = 2000

export const TicketValidationHint = {
  SelectCustomer: 'support.create.hints.selectCustomer',
  SubjectRequired: 'support.create.hints.subjectRequired',
  SubjectTooLong: 'support.create.hints.subjectTooLong',
  DescriptionRequired: 'support.create.hints.descriptionRequired',
  DescriptionTooLong: 'support.create.hints.descriptionTooLong'
} as const

export interface TicketOrderOptionVM {
  uuid: UUID
  label: string
}

export interface TicketPriorityOptionVM {
  value: TicketPriority
  labelKey: string
}

const prioritiesFromMostToLeastUrgent: Array<TicketPriority> = [
  TicketPriority.URGENT,
  TicketPriority.HIGH,
  TicketPriority.MEDIUM,
  TicketPriority.LOW
]

const toOrderOption = (order: Order): TicketOrderOptionVM => {
  const date = timestampToLocaleString(order.createdAt, 'fr-FR')
  const total = priceFormatter('fr-FR', 'EUR').format(
    computeTotalWithTaxForOrder(order) / 100
  )
  return { uuid: order.uuid, label: `${date} · ${total}` }
}

const textHint = (
  text: string,
  maxLength: number,
  requiredHint: string,
  tooLongHint: string
): Array<string> => {
  if (text.trim().length === 0) return [requiredHint]
  if (text.length > maxLength) return [tooLongHint]
  return []
}

export class TicketFormFieldsReader extends FormFieldsReader {}

export class TicketFormFieldsWriter extends FormFieldsWriter {
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string) {
    super(key)
    this.fieldHandlers = {
      customerUuid: this.setCustomerUuid.bind(this),
      customer: this.setCustomer.bind(this)
    }
  }

  override set(fieldName: string, value: any): void {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    handler(value)
  }

  private setCustomerUuid(uuid: UUID): void {
    const searchStore = useSearchStore()
    const results: Array<Customer> =
      searchStore.get(TICKET_CUSTOMER_SEARCH_NAMESPACE) || []
    const customer = results.find((c) => c.uuid === uuid)
    if (!customer) {
      this.setCustomer(undefined)
      return
    }
    this.setCustomer({
      uuid: customer.uuid,
      email: customer.email,
      ...(customer.firstname && { firstname: customer.firstname }),
      ...(customer.lastname && { lastname: customer.lastname })
    })
  }

  private setCustomer(customer: TicketCustomer | undefined): void {
    super.set('customer', customer)
    super.set('orderUuid', undefined)
  }
}

export class NewTicketFormInitializer implements FormInitializer {
  private readonly key: string

  constructor(key: string) {
    this.key = key
  }

  init(): void {
    const formStore = useFormStore()
    formStore.set(this.key, {
      customer: undefined,
      orderUuid: undefined,
      subject: '',
      description: '',
      priority: TicketPriority.MEDIUM,
      attachments: []
    })
  }
}

export class TicketFormCreateVM {
  private readonly fieldsReader: TicketFormFieldsReader
  private readonly fieldsWriter: TicketFormFieldsWriter

  constructor(
    initializer: FormInitializer,
    fieldsReader: TicketFormFieldsReader,
    fieldsWriter: TicketFormFieldsWriter
  ) {
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
    initializer.init()
  }

  get(fieldName: string): Field<any> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  set(fieldName: string, value: any): void {
    this.fieldsWriter.set(fieldName, value)
  }

  getCustomer(): TicketCustomer | undefined {
    return this.fieldsReader.get('customer')
  }

  getAvailableOrders(): Array<TicketOrderOptionVM> {
    const orders: Array<Order> =
      useSearchStore().get(TICKET_ORDERS_SEARCH_NAMESPACE) || []
    return orders.map(toOrderOption)
  }

  isLoadingOrders(): boolean {
    return useSearchStore().isLoading(TICKET_ORDERS_SEARCH_NAMESPACE)
  }

  getPriorityOptions(): Array<TicketPriorityOptionVM> {
    return prioritiesFromMostToLeastUrgent.map((priority) => ({
      value: priority,
      labelKey: `support.priority.${priority.toLowerCase()}`
    }))
  }

  getValidationHints(): Array<string> {
    const customerHints = this.getCustomer()
      ? []
      : [TicketValidationHint.SelectCustomer]
    return [
      ...customerHints,
      ...textHint(
        this.fieldsReader.get('subject'),
        TICKET_SUBJECT_MAX_LENGTH,
        TicketValidationHint.SubjectRequired,
        TicketValidationHint.SubjectTooLong
      ),
      ...textHint(
        this.fieldsReader.get('description'),
        TICKET_DESCRIPTION_MAX_LENGTH,
        TicketValidationHint.DescriptionRequired,
        TicketValidationHint.DescriptionTooLong
      )
    ]
  }

  getCanValidate(): boolean {
    return this.getValidationHints().length === 0 && !this.isSaving()
  }

  isSaving(): boolean {
    return useTicketStore().isSaving
  }

  getDto(): CreateTicketDTO {
    const orderUuid: UUID | undefined = this.fieldsReader.get('orderUuid')
    return {
      customer: this.fieldsReader.get('customer'),
      subject: this.fieldsReader.get('subject'),
      description: this.fieldsReader.get('description'),
      priority: this.fieldsReader.get('priority'),
      ...(orderUuid && { orderUuid }),
      attachments: this.fieldsReader.get('attachments')
    }
  }

  getCreatedTicketUuid(): UUID | undefined {
    return useTicketStore().currentTicket?.uuid
  }
}

export const ticketFormCreateVM = (key: string): TicketFormCreateVM => {
  const initializer = new NewTicketFormInitializer(key)
  const reader = new TicketFormFieldsReader(key)
  const writer = new TicketFormFieldsWriter(key)
  return new TicketFormCreateVM(initializer, reader, writer)
}
