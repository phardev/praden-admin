import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useFormStore } from '@store/formStore'
import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { getFileContent } from '@utils/file'
import { CreateBannerDTO } from '@core/usecases/banners/banner-creation/createBanner'

export class BannerFormFieldsWriter extends FormFieldsWriter {
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string) {
    super(key)
    this.fieldHandlers = {
      img: this.setImg.bind(this)
    }
  }

  async set(fieldName: string, value: any): Promise<any> {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    await handler(value)
  }

  async setImg(img: File): Promise<void> {
    const data = await getFileContent(img)
    super.set('img', data)
    super.set('newImg', img)
  }
}

class NewBannerFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }
  init() {
    this.formStore.set(this.key, {
      isActive: true,
      href: ''
    })
  }
}

export abstract class BannerFormVM {
  private readonly key: string
  protected fieldsReader: BannerFormFieldsReader

  protected constructor(fieldsReader: BannerFormFieldsReader, key: string) {
    this.fieldsReader = fieldsReader
    this.key = key
  }
}

export class BannerFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
  }
}

export class BannerFormCreateVM extends BannerFormVM {
  private fieldsWriter: BannerFormFieldsWriter

  constructor(
    initializer: NewBannerFormInitializer,
    fieldsReader: BannerFormFieldsReader,
    fieldsWriter: BannerFormFieldsWriter,
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

  getDto(): CreateBannerDTO {
    const order = this.fieldsReader.get('order')
    const startDate = this.fieldsReader.get('startDate')
    const endDate = this.fieldsReader.get('endDate')
    return {
      img: this.fieldsReader.get('newImg'),
      href: this.fieldsReader.get('href'),
      isActive: this.fieldsReader.get('isActive'),
      ...(order && { order: +order - 1 }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    }
  }
  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const bannerFormCreateVM = (key: string): BannerFormCreateVM => {
  const initializer = new NewBannerFormInitializer(key)
  const reader = new BannerFormFieldsReader(key)
  const writer = new BannerFormFieldsWriter(key)
  return new BannerFormCreateVM(initializer, reader, writer, key)
}
