import { useStaffStore } from '@store/staffStore'
import { useFormStore } from '@store/formStore'

export interface Field<T> {
  value: T
  canEdit: boolean
}

export interface FormInitializer {
  init(): void
}

export class FormFieldsReader {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  get(fieldName: string): any {
    return this.formStore.get(this.key)?.[fieldName]
  }
}

export class FormFieldsWriter {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  set(fieldName: string, value: any): void {
    this.formStore.set(this.key, { [fieldName]: value })
  }
}

export class StaffFormVM {
  isLoading(): boolean {
    const staffStore = useStaffStore()
    return staffStore.isLoading
  }
}
