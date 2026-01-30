import { CustomerFormFieldsReader } from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'
import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { CreateCustomerDTO } from '@core/usecases/customers/customer-creation/createCustomer'
import { useFormStore } from '@store/formStore'

export class NewCustomerFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init() {
    this.formStore.set(this.key, {
      firstname: '',
      lastname: '',
      email: '',
      phone: ''
    })
  }
}

export class CustomerFormFieldsWriter extends FormFieldsWriter {
  constructor(key: string) {
    super(key)
  }
}

export class CustomerFormCreateVM {
  protected initializer: NewCustomerFormInitializer
  protected fieldsReader: CustomerFormFieldsReader
  private fieldsWriter: CustomerFormFieldsWriter

  constructor(
    initializer: NewCustomerFormInitializer,
    fieldReader: CustomerFormFieldsReader,
    fieldWriter: CustomerFormFieldsWriter
  ) {
    this.initializer = initializer
    this.fieldsReader = fieldReader
    this.fieldsWriter = fieldWriter
    initializer.init()
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  set(fieldName: string, value: any): void {
    this.fieldsWriter.set(fieldName, value)
  }

  getDto(): CreateCustomerDTO {
    return {
      firstname: this.fieldsReader.get('firstname'),
      lastname: this.fieldsReader.get('lastname'),
      email: this.fieldsReader.get('email'),
      phone: this.fieldsReader.get('phone'),
      ordersCount: 0,
      ordersTotal: 0,
      loyaltyPointsBalance: 0
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const customerFormCreateVM = (key: string): CustomerFormCreateVM => {
  const initializer = new NewCustomerFormInitializer(key)
  const reader = new CustomerFormFieldsReader(key)
  const writer = new CustomerFormFieldsWriter(key)
  return new CustomerFormCreateVM(initializer, reader, writer)
}
