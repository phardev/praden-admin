import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { Customer } from '@core/entities/customer'
import { DateProvider } from '@core/gateways/dateProvider'
import { UUID } from '@core/types/types'
import { useFormStore } from '@store/formStore'
import { useSearchStore } from '@store/searchStore'
import { useVoucherStore } from '@store/voucherStore'
import { Field } from '../../promotions/promotion-form/promotionFormCreateVM'
import { VoucherFormFieldsReader } from './voucherFormGetVM'
import { VoucherFormVM } from './voucherFormVM'

export const VOUCHER_CUSTOMER_SEARCH_NAMESPACE = 'voucher-create-customer'

export class VoucherFormFieldsWriter extends FormFieldsWriter {
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string) {
    super(key)
    this.fieldHandlers = {
      customerUuid: this.setCustomerUuid.bind(this)
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
      searchStore.get(VOUCHER_CUSTOMER_SEARCH_NAMESPACE) || []
    const customer = results.find((c) => c.uuid === uuid)
    if (!customer) {
      super.set('customer', undefined)
      return
    }
    super.set('customer', {
      uuid: customer.uuid,
      email: customer.email,
      ...(customer.firstname && { firstname: customer.firstname }),
      ...(customer.lastname && { lastname: customer.lastname })
    })
  }
}

export class NewVoucherFormInitializer implements FormInitializer {
  private readonly key: string

  constructor(key: string) {
    this.key = key
  }

  init(): void {
    const formStore = useFormStore()
    const voucherStore = useVoucherStore()
    formStore.set(this.key, {
      code: voucherStore.suggestedCode,
      amount: undefined,
      customer: undefined,
      expirationDate: undefined
    })
  }
}

export class VoucherFormCreateVM extends VoucherFormVM {
  private readonly fieldsWriter: VoucherFormFieldsWriter

  constructor(
    initializer: FormInitializer,
    fieldsReader: VoucherFormFieldsReader,
    fieldsWriter: VoucherFormFieldsWriter,
    dateProvider: DateProvider
  ) {
    super(fieldsReader, dateProvider)
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
}

export const voucherFormCreateVM = (
  key: string,
  dateProvider: DateProvider
) => {
  const initializer = new NewVoucherFormInitializer(key)
  const reader = new VoucherFormFieldsReader(key)
  const writer = new VoucherFormFieldsWriter(key)
  return new VoucherFormCreateVM(initializer, reader, writer, dateProvider)
}
