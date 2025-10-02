import {
  StaffFormVM,
  FormFieldsReader,
  FormFieldsWriter,
  FormInitializer,
  type Field
} from '@adapters/primary/view-models/staff/staff-form/staffFormVM'
import { useFormStore } from '@store/formStore'
import { useStaffStore } from '@store/staffStore'
import { EditStaffDTO } from '@core/gateways/staffGateway'
import { UUID } from '@core/types/types'

export class ExistingStaffFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  protected staffStore: any
  protected staffUuid: UUID

  constructor(key: string, staffUuid: UUID) {
    this.key = key
    this.staffUuid = staffUuid
    this.formStore = useFormStore()
    this.staffStore = useStaffStore()
  }

  init(): void {
    const staff = this.staffStore.getByUuid(this.staffUuid)
    if (!staff) {
      throw new Error(`Staff with UUID ${this.staffUuid} not found`)
    }

    this.formStore.set(this.key, {
      email: staff.email || '',
      firstname: staff.firstname || '',
      lastname: staff.lastname || '',
      roleUuid: staff.role.uuid || ''
    })
  }
}

export class StaffFormEditVM extends StaffFormVM {
  private fieldsReader: FormFieldsReader
  private fieldsWriter: FormFieldsWriter

  constructor(
    initializer: ExistingStaffFormInitializer,
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

  getDto(): EditStaffDTO {
    const dto: EditStaffDTO = {
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

export const staffFormEditVM = (
  key: string,
  staffUuid: UUID
): StaffFormEditVM => {
  const initializer = new ExistingStaffFormInitializer(key, staffUuid)
  const reader = new FormFieldsReader(key)
  const writer = new FormFieldsWriter(key)
  return new StaffFormEditVM(initializer, reader, writer)
}
