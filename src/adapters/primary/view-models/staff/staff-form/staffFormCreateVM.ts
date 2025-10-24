import {
  type Field,
  FormFieldsReader,
  FormFieldsWriter,
  FormInitializer,
  StaffFormVM
} from '@adapters/primary/view-models/staff/staff-form/staffFormVM'
import { CreateStaffDTO } from '@core/gateways/staffGateway'
import { useFormStore } from '@store/formStore'

export class NewStaffFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init(): void {
    this.formStore.set(this.key, {
      email: '',
      firstname: '',
      lastname: '',
      roleUuid: ''
    })
  }
}

export class StaffFormCreateVM extends StaffFormVM {
  private fieldsReader: FormFieldsReader
  private fieldsWriter: FormFieldsWriter

  constructor(
    initializer: NewStaffFormInitializer,
    fieldsReader: FormFieldsReader,
    fieldsWriter: FormFieldsWriter
  ) {
    super()
    initializer.init()
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
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

  async set(fieldName: string, value: any): Promise<void> {
    this.fieldsWriter.set(fieldName, value)
  }

  getCanValidate(): boolean {
    const email = this.fieldsReader.get('email')
    const roleUuid = this.fieldsReader.get('roleUuid')

    return !!(
      email &&
      email.trim().length > 0 &&
      roleUuid &&
      roleUuid.trim().length > 0
    )
  }

  getDto(): CreateStaffDTO {
    const dto: CreateStaffDTO = {
      email: this.fieldsReader.get('email'),
      roleUuid: this.fieldsReader.get('roleUuid')
    }

    const firstname = this.fieldsReader.get('firstname')
    if (firstname && firstname.trim().length > 0) {
      dto.firstname = firstname
    }

    const lastname = this.fieldsReader.get('lastname')
    if (lastname && lastname.trim().length > 0) {
      dto.lastname = lastname
    }

    return dto
  }
}

export const staffFormCreateVM = (key: string): StaffFormCreateVM => {
  const initializer = new NewStaffFormInitializer(key)
  const reader = new FormFieldsReader(key)
  const writer = new FormFieldsWriter(key)
  return new StaffFormCreateVM(initializer, reader, writer)
}
