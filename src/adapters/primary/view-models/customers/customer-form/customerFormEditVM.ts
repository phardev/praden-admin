import { CustomerFormFieldsWriter } from '@adapters/primary/view-models/customers/customer-form/customerFormCreateVM'
import {
  CustomerFormFieldsReader,
  ExistingCustomerFormInitializer
} from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'
import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { CreateCustomerDTO } from '@core/usecases/customers/customer-creation/createCustomer'

export class CustomerFormEditVM {
  protected initializer: ExistingCustomerFormInitializer
  protected fieldsReader: CustomerFormFieldsReader
  private fieldsWriter: CustomerFormFieldsWriter

  constructor(
    initializer: ExistingCustomerFormInitializer,
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
      ordersCount: this.fieldsReader.get('ordersCount'),
      ordersTotal: this.fieldsReader.get('ordersTotal')
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const customerFormEditVM = (key: string): CustomerFormEditVM => {
  const initializer = new ExistingCustomerFormInitializer(key)
  const reader = new CustomerFormFieldsReader(key)
  const writer = new CustomerFormFieldsWriter(key)
  return new CustomerFormEditVM(initializer, reader, writer)
}
