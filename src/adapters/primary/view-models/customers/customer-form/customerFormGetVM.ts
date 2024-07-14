import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useFormStore } from '@store/formStore'
import { useCustomerStore } from '@store/customerStore'
import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { DeliveryStatus, PaymentStatus } from '@core/entities/order'

export class ExistingCustomerFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  protected customerStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.customerStore = useCustomerStore()
  }

  init() {
    let customer = this.customerStore.current
    if (customer) {
      customer = JSON.parse(JSON.stringify(customer))
    }
    this.formStore.set(this.key, {
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone
    })
  }
}

export interface CustomerOrderItemVM {
  reference: string
  href: string
  createdDate: string
  createdDatetime: Date
  deliveryStatus: DeliveryStatus
  total: string
  paymentStatus: PaymentStatus
}

export class CustomerFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
  }
}

export class CustomerFormGetVM {
  protected initializer: ExistingCustomerFormInitializer
  protected fieldsReader: CustomerFormFieldsReader

  constructor(
    initializer: ExistingCustomerFormInitializer,
    fieldReader: CustomerFormFieldsReader
  ) {
    this.initializer = initializer
    this.fieldsReader = fieldReader
    initializer.init()
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: false
    }
  }

  getDisplayValidate(): boolean {
    return false
  }

  getCanValidate(): boolean {
    return false
  }
}

export const customerFormGetVM = (key: string): CustomerFormGetVM => {
  const initializer = new ExistingCustomerFormInitializer(key)
  const reader = new CustomerFormFieldsReader(key)
  return new CustomerFormGetVM(initializer, reader)
}
