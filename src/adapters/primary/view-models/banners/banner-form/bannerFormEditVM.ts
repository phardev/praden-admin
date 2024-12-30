import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useFormStore } from '@store/formStore'
import { CreateBannerDTO } from '@core/usecases/banners/banner-creation/createBanner'
import { useBannerStore } from '@store/bannerStore'
import {
  BannerFormFieldsReader,
  BannerFormFieldsWriter,
  BannerFormVM
} from '@adapters/primary/view-models/banners/banner-form/bannerFormCreateVM'

class ExistingBannerFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  private bannerStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.bannerStore = useBannerStore()
  }

  init() {
    let banner = this.bannerStore.current
    if (banner) {
      banner = JSON.parse(JSON.stringify(banner))
    }
    this.formStore.set(this.key, {
      img: banner.img,
      order: banner.order + 1,
      isActive: banner.isActive,
      href: banner.href,
      startDate: banner.startDate,
      endDate: banner.endDate
    })
  }
}

export class BannerFormEditVM extends BannerFormVM {
  private fieldsWriter: BannerFormFieldsWriter

  constructor(
    initializer: ExistingBannerFormInitializer,
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
      order: +order - 1,
      startDate: startDate,
      endDate: endDate
    }
  }
  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const bannerFormEditVM = (key: string): BannerFormEditVM => {
  const initializer = new ExistingBannerFormInitializer(key)
  const reader = new BannerFormFieldsReader(key)
  const writer = new BannerFormFieldsWriter(key)
  return new BannerFormEditVM(initializer, reader, writer, key)
}
