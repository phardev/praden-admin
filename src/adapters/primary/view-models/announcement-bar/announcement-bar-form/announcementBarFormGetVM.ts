import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useFormStore } from '@store/formStore'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  AnnouncementBarFormFieldsReader,
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
    let bar = this.announcementBarStore.current
    if (bar) {
      bar = JSON.parse(JSON.stringify(bar))
    }
    this.formStore.set(this.key, {
      text: bar.text,
      isActive: bar.isActive,
      startDate: bar.startDate,
      endDate: bar.endDate
    })
  }
}

export class AnnouncementBarFormGetVM extends AnnouncementBarFormVM {
  protected initializer: ExistingAnnouncementBarFormInitializer

  constructor(
    initializer: ExistingAnnouncementBarFormInitializer,
    fieldsReader: AnnouncementBarFormFieldsReader,
    key: string
  ) {
    super(fieldsReader, key)
    this.initializer = initializer
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

export const announcementBarFormGetVM = (
  key: string
): AnnouncementBarFormGetVM => {
  const initializer = new ExistingAnnouncementBarFormInitializer(key)
  const reader = new AnnouncementBarFormFieldsReader(key)
  return new AnnouncementBarFormGetVM(initializer, reader, key)
}
