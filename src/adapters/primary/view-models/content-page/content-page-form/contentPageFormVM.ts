import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  CONTENT_PAGE_MAX_META_DESCRIPTION_LENGTH,
  CONTENT_PAGE_MAX_TITLE_LENGTH,
  ContentPageSlug
} from '@core/entities/contentPage'
import type { EditContentPageDTO } from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'
import { useFormStore } from '@store/formStore'

export const contentPageFormKey = (slug: ContentPageSlug): string =>
  `content-page-form-${slug}`

class ExistingContentPageFormInitializer implements FormInitializer {
  private readonly key: string
  private formStore: any
  private contentPageStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.contentPageStore = useContentPageStore()
  }

  init() {
    const contentPage = this.contentPageStore.current
    if (!contentPage) {
      throw new Error('No content page found in store')
    }
    const copy = JSON.parse(JSON.stringify(contentPage))
    this.formStore.set(this.key, {
      title: copy.title,
      metaDescription: copy.metaDescription,
      html: copy.html
    })
  }
}

export class ContentPageFormVM {
  private readonly fieldsReader: FormFieldsReader
  private readonly fieldsWriter: FormFieldsWriter
  private readonly initialDto: EditContentPageDTO

  constructor(
    initializer: ExistingContentPageFormInitializer,
    fieldsReader: FormFieldsReader,
    fieldsWriter: FormFieldsWriter
  ) {
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
    initializer.init()
    this.initialDto = this.getDto()
  }

  get hasChanges(): boolean {
    return JSON.stringify(this.getDto()) !== JSON.stringify(this.initialDto)
  }

  get(fieldName: string): Field<string> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  set(fieldName: string, value: string): void {
    this.fieldsWriter.set(fieldName, value)
  }

  getDto(): EditContentPageDTO {
    return {
      title: this.fieldsReader.get('title'),
      metaDescription: this.fieldsReader.get('metaDescription'),
      html: this.fieldsReader.get('html')
    }
  }

  getMetaDescriptionLength(): number {
    return this.read('metaDescription').length
  }

  getCanValidate(): boolean {
    return (
      this.isFilled('title') &&
      this.isFilled('metaDescription') &&
      this.isFilled('html') &&
      this.read('title').length <= CONTENT_PAGE_MAX_TITLE_LENGTH &&
      this.getMetaDescriptionLength() <=
        CONTENT_PAGE_MAX_META_DESCRIPTION_LENGTH
    )
  }

  getDisplayValidate(): boolean {
    return true
  }

  private read(fieldName: string): string {
    return this.fieldsReader.get(fieldName) ?? ''
  }

  private isFilled(fieldName: string): boolean {
    return this.read(fieldName).trim().length > 0
  }
}

export const contentPageFormVM = (slug: ContentPageSlug): ContentPageFormVM => {
  const key = contentPageFormKey(slug)
  return new ContentPageFormVM(
    new ExistingContentPageFormInitializer(key),
    new FormFieldsReader(key),
    new FormFieldsWriter(key)
  )
}
