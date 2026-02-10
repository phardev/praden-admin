import type {
  CreateMultiplierDTO,
  EditMultiplierDTO
} from '@core/entities/loyalty'
import type { UUID } from '@core/types/types'
import { useFormStore } from '@store/formStore'
import { useLoyaltyStore } from '@store/loyaltyStore'

export interface Field<T> {
  value: T
  canEdit: boolean
}

class MultiplierFormFieldsReader {
  protected readonly key: string
  protected formStore: ReturnType<typeof useFormStore>

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  get(fieldName: string): any {
    const form = this.formStore.get(this.key)
    if (!form) return undefined
    return form[fieldName]
  }
}

class MultiplierFormFieldsWriter {
  protected readonly key: string
  protected formStore: ReturnType<typeof useFormStore>

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  set(fieldName: string, value: any): void {
    const form = this.formStore.get(this.key)
    if (!form) return
    form[fieldName] = value
    this.formStore.set(this.key, { ...form })
  }
}

class NewMultiplierFormInitializer {
  protected readonly key: string
  protected formStore: ReturnType<typeof useFormStore>

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init(): void {
    this.formStore.set(this.key, {
      name: '',
      multiplierValue: 2,
      startDate: null,
      endDate: null
    })
  }
}

class ExistingMultiplierFormInitializer {
  protected readonly key: string
  protected formStore: ReturnType<typeof useFormStore>
  private loyaltyStore: ReturnType<typeof useLoyaltyStore>
  private multiplierUuid: UUID

  constructor(key: string, multiplierUuid: UUID) {
    this.key = key
    this.formStore = useFormStore()
    this.loyaltyStore = useLoyaltyStore()
    this.multiplierUuid = multiplierUuid
  }

  init(): void {
    const multiplier = this.loyaltyStore.multipliers.find(
      (m) => m.uuid === this.multiplierUuid
    )
    if (!multiplier) {
      throw new Error('Multiplier not found in store')
    }

    this.formStore.set(this.key, {
      name: multiplier.name,
      multiplierValue: multiplier.multiplierValue,
      startDate: multiplier.startDate,
      endDate: multiplier.endDate
    })
  }
}

export class MultiplierFormCreateVM {
  private fieldsReader: MultiplierFormFieldsReader
  private fieldsWriter: MultiplierFormFieldsWriter

  constructor(
    initializer: NewMultiplierFormInitializer,
    fieldsReader: MultiplierFormFieldsReader,
    fieldsWriter: MultiplierFormFieldsWriter
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

  async set(fieldName: string, value: any): Promise<void> {
    this.fieldsWriter.set(fieldName, value)
  }

  getDto(): CreateMultiplierDTO {
    return {
      name: this.fieldsReader.get('name'),
      multiplierValue: this.fieldsReader.get('multiplierValue'),
      startDate: this.fieldsReader.get('startDate'),
      endDate: this.fieldsReader.get('endDate')
    }
  }

  isValid(): boolean {
    const name = this.fieldsReader.get('name')
    const startDate = this.fieldsReader.get('startDate')
    const endDate = this.fieldsReader.get('endDate')

    return name !== '' && startDate !== null && endDate !== null
  }
}

export class MultiplierFormEditVM {
  private fieldsReader: MultiplierFormFieldsReader
  private fieldsWriter: MultiplierFormFieldsWriter

  constructor(
    initializer: ExistingMultiplierFormInitializer,
    fieldsReader: MultiplierFormFieldsReader,
    fieldsWriter: MultiplierFormFieldsWriter
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

  async set(fieldName: string, value: any): Promise<void> {
    this.fieldsWriter.set(fieldName, value)
  }

  getDto(): EditMultiplierDTO {
    return {
      name: this.fieldsReader.get('name'),
      multiplierValue: this.fieldsReader.get('multiplierValue'),
      startDate: this.fieldsReader.get('startDate'),
      endDate: this.fieldsReader.get('endDate')
    }
  }

  isValid(): boolean {
    const name = this.fieldsReader.get('name')
    const startDate = this.fieldsReader.get('startDate')
    const endDate = this.fieldsReader.get('endDate')

    return name !== '' && startDate !== null && endDate !== null
  }
}

export const multiplierFormCreateVM = (key: string): MultiplierFormCreateVM => {
  const initializer = new NewMultiplierFormInitializer(key)
  const reader = new MultiplierFormFieldsReader(key)
  const writer = new MultiplierFormFieldsWriter(key)
  return new MultiplierFormCreateVM(initializer, reader, writer)
}

export const multiplierFormEditVM = (
  key: string,
  multiplierUuid: UUID
): MultiplierFormEditVM => {
  const initializer = new ExistingMultiplierFormInitializer(key, multiplierUuid)
  const reader = new MultiplierFormFieldsReader(key)
  const writer = new MultiplierFormFieldsWriter(key)
  return new MultiplierFormEditVM(initializer, reader, writer)
}
