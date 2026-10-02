import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  CONTENT_PAGE_MAX_META_DESCRIPTION_LENGTH,
  CONTENT_PAGE_MAX_NAME_LENGTH,
  CONTENT_PAGE_MAX_TITLE_LENGTH,
  ContentPageStatus,
  contentPageSlugFromName,
  isValidContentPageSlug
} from '@core/entities/contentPage'
import { FooterSection } from '@core/entities/footer'
import type {
  CreateContentPageDTO,
  EditContentPageDTO
} from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'
import { useFormStore } from '@store/formStore'

export const NO_FOOTER_SECTION = 'NONE'

export type FooterSectionChoice = FooterSection | typeof NO_FOOTER_SECTION

const contentPageFormKey = (slug?: string): string =>
  slug ? `content-page-form-${slug}` : 'content-page-form-new'

interface ContentPageFormFields {
  slug: string
  name: string
  title: string
  metaDescription: string
  html: string
  status: ContentPageStatus
  footerSection: FooterSectionChoice
  isMandatory: boolean
}

class NewContentPageFormInitializer implements FormInitializer {
  private readonly key: string
  private formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init() {
    const fields: ContentPageFormFields = {
      slug: '',
      name: '',
      title: '',
      metaDescription: '',
      html: '',
      status: ContentPageStatus.DRAFT,
      footerSection: NO_FOOTER_SECTION,
      isMandatory: false
    }
    this.formStore.set(this.key, fields)
  }
}

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
    const fields: ContentPageFormFields = {
      slug: copy.slug,
      name: copy.name,
      title: copy.title,
      metaDescription: copy.metaDescription,
      html: copy.html,
      status: copy.status,
      footerSection: copy.footerSection ?? NO_FOOTER_SECTION,
      isMandatory: copy.isMandatory
    }
    this.formStore.set(this.key, fields)
  }
}

type FieldSetter = (value: any) => void

export class ContentPageFormVM {
  private readonly fieldsReader: FormFieldsReader
  private readonly fieldsWriter: FormFieldsWriter
  private readonly isCreation: boolean
  private readonly initialFields: string
  private readonly initialStatus: ContentPageStatus
  private readonly initialFooterSection: FooterSectionChoice
  private readonly setters: Record<string, FieldSetter> = {
    name: (value) => this.setName(value)
  }

  constructor(
    initializer: FormInitializer,
    fieldsReader: FormFieldsReader,
    fieldsWriter: FormFieldsWriter,
    isCreation: boolean
  ) {
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
    this.isCreation = isCreation
    initializer.init()
    this.initialStatus = this.fieldsReader.get('status')
    this.initialFooterSection = this.fieldsReader.get('footerSection')
    this.initialFields = this.snapshot()
  }

  get hasChanges(): boolean {
    return this.snapshot() !== this.initialFields
  }

  get(fieldName: string): Field<any> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: fieldName === 'slug' ? this.isCreation : true
    }
  }

  set(fieldName: string, value: any): void {
    const setter = this.setters[fieldName]
    if (setter) {
      setter(value)
      return
    }
    this.fieldsWriter.set(fieldName, value)
  }

  isMandatory(): boolean {
    return this.fieldsReader.get('isMandatory')
  }

  getStatusOptions(): Array<ContentPageStatus> {
    if (this.isMandatory()) return [ContentPageStatus.PUBLISHED]
    return [ContentPageStatus.DRAFT, ContentPageStatus.PUBLISHED]
  }

  getFooterSectionOptions(): Array<FooterSectionChoice> {
    const sections = [FooterSection.PHARMACY, FooterSection.LEGAL]
    if (this.isMandatory()) return sections
    return [NO_FOOTER_SECTION, ...sections]
  }

  getCreateDto(): CreateContentPageDTO {
    return {
      slug: this.text('slug'),
      ...this.contentDto()
    }
  }

  getEditDto(): EditContentPageDTO {
    return this.contentDto()
  }

  getStatusTransition(): ContentPageStatus | undefined {
    const status = this.fieldsReader.get('status')
    if (status === this.initialStatus) return undefined
    return status
  }

  getFooterTransition(): FooterSectionChoice | undefined {
    const footerSection = this.fieldsReader.get('footerSection')
    if (footerSection === this.initialFooterSection) return undefined
    return footerSection
  }

  getPublicPath(): string {
    return `/${this.text('slug')}`
  }

  getMetaDescriptionLength(): number {
    return this.text('metaDescription').length
  }

  getCanValidate(): boolean {
    return (
      this.isFilled('name') &&
      this.text('name').length <= CONTENT_PAGE_MAX_NAME_LENGTH &&
      this.isFilled('title') &&
      this.text('title').length <= CONTENT_PAGE_MAX_TITLE_LENGTH &&
      this.isFilled('metaDescription') &&
      this.getMetaDescriptionLength() <=
        CONTENT_PAGE_MAX_META_DESCRIPTION_LENGTH &&
      this.isFilled('html') &&
      isValidContentPageSlug(this.text('slug'))
    )
  }

  private setName(name: string): void {
    const previousName = this.text('name')
    const previousSlug = this.text('slug')
    this.fieldsWriter.set('name', name)
    if (!this.isCreation) return
    if (previousSlug !== contentPageSlugFromName(previousName)) return
    this.fieldsWriter.set('slug', contentPageSlugFromName(name))
  }

  private contentDto(): EditContentPageDTO {
    return {
      name: this.text('name'),
      title: this.text('title'),
      metaDescription: this.text('metaDescription'),
      html: this.text('html')
    }
  }

  private text(fieldName: string): string {
    return this.fieldsReader.get(fieldName) ?? ''
  }

  private isFilled(fieldName: string): boolean {
    return this.text(fieldName).trim().length > 0
  }

  private snapshot(): string {
    return JSON.stringify({
      ...this.contentDto(),
      slug: this.text('slug'),
      status: this.fieldsReader.get('status'),
      footerSection: this.fieldsReader.get('footerSection')
    })
  }
}

export const contentPageFormVM = (slug?: string): ContentPageFormVM => {
  const key = contentPageFormKey(slug)
  const initializer = slug
    ? new ExistingContentPageFormInitializer(key)
    : new NewContentPageFormInitializer(key)
  return new ContentPageFormVM(
    initializer,
    new FormFieldsReader(key),
    new FormFieldsWriter(key),
    slug === undefined
  )
}
