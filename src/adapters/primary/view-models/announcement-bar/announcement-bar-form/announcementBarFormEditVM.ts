import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useFormStore } from '@store/formStore'
import { EditAnnouncementBarDTO } from '@core/gateways/announcementBarGateway'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  AnnouncementBarFormFieldsReader,
  AnnouncementBarFormFieldsWriter,
  AnnouncementBarFormVM
} from '@adapters/primary/view-models/announcement-bar/announcement-bar-form/announcementBarFormCreateVM'

class ExistingAnnouncementBarFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  private announcementBarStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.announcementBarStore = useAnnouncementBarStore()
  }

  init() {
    const bar = this.announcementBarStore.current
    if (!bar) {
      throw new Error('No announcement bar found in store')
    }
    const barCopy = JSON.parse(JSON.stringify(bar))
    this.formStore.set(this.key, {
      text: barCopy.text,
      isActive: barCopy.isActive,
      startDate: barCopy.startDate,
      endDate: barCopy.endDate
    })
  }
}

export class AnnouncementBarFormEditVM extends AnnouncementBarFormVM {
  private fieldsWriter: AnnouncementBarFormFieldsWriter

  constructor(
    initializer: ExistingAnnouncementBarFormInitializer,
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

  getDto(): EditAnnouncementBarDTO {
    const startDate = this.fieldsReader.get('startDate')
    const endDate = this.fieldsReader.get('endDate')
    return {
      text: this.fieldsReader.get('text'),
      isActive: this.fieldsReader.get('isActive'),
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const announcementBarFormEditVM = (
  key: string
): AnnouncementBarFormEditVM => {
  const initializer = new ExistingAnnouncementBarFormInitializer(key)
  const reader = new AnnouncementBarFormFieldsReader(key)
  const writer = new AnnouncementBarFormFieldsWriter(key)
  return new AnnouncementBarFormEditVM(initializer, reader, writer, key)
}
