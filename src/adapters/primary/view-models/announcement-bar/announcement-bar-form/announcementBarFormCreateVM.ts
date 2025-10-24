import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import type { CreateAnnouncementBarDTO } from '@core/gateways/announcementBarGateway'
import { useFormStore } from '@store/formStore'

export class AnnouncementBarFormFieldsWriter extends FormFieldsWriter {
  constructor(key: string) {
    super(key)
  }
}

class NewAnnouncementBarFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init() {
    this.formStore.set(this.key, {
      isActive: true,
      text: '',
      startDate: undefined,
      endDate: undefined
    })
  }
}

export abstract class AnnouncementBarFormVM {
  private readonly key: string
  protected fieldsReader: AnnouncementBarFormFieldsReader

  protected constructor(
    fieldsReader: AnnouncementBarFormFieldsReader,
    key: string
  ) {
    this.fieldsReader = fieldsReader
    this.key = key
  }
}

export class AnnouncementBarFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
  }
}

export class AnnouncementBarFormCreateVM extends AnnouncementBarFormVM {
  private fieldsWriter: AnnouncementBarFormFieldsWriter

  constructor(
    initializer: NewAnnouncementBarFormInitializer,
    fieldsReader: AnnouncementBarFormFieldsReader,
    fieldsWriter: AnnouncementBarFormFieldsWriter,
    key: string
  ) {
    super(fieldsReader, key)
    this.fieldsWriter = fieldsWriter
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

  async set(fieldName: string, value: any): Promise<void> {
    await this.fieldsWriter.set(fieldName, value)
  }

  getDto(): CreateAnnouncementBarDTO {
    const startDate = this.fieldsReader.get('startDate')
    const endDate = this.fieldsReader.get('endDate')
    return {
      text: this.fieldsReader.get('text'),
      isActive: this.fieldsReader.get('isActive'),
      ...(startDate && { startDate: new Date(startDate).toISOString() }),
      ...(endDate && { endDate: new Date(endDate).toISOString() })
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const announcementBarFormCreateVM = (
  key: string
): AnnouncementBarFormCreateVM => {
  const initializer = new NewAnnouncementBarFormInitializer(key)
  const reader = new AnnouncementBarFormFieldsReader(key)
  const writer = new AnnouncementBarFormFieldsWriter(key)
  return new AnnouncementBarFormCreateVM(initializer, reader, writer, key)
}
