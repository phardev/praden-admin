import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  BLOG_POST_MAX_META_DESCRIPTION_LENGTH,
  BLOG_POST_MAX_META_TITLE_LENGTH,
  BLOG_POST_MAX_TAGS,
  BLOG_POST_MAX_TITLE_LENGTH,
  BlogPostStatus,
  blogPostSlugFromTitle,
  isValidBlogPostSlug
} from '@core/entities/blogPost'
import type {
  CreateBlogPostDTO,
  EditBlogPostDTO
} from '@core/gateways/blogPostGateway'
import type { DateProvider } from '@core/gateways/dateProvider'
import { Timestamp, UUID } from '@core/types/types'
import { useBlogPostStore } from '@store/blogPostStore'
import { useFormStore } from '@store/formStore'

const BLOG_POST_PUBLIC_PREFIX = '/blog/'

const atUtcMidnight = (timestamp: Timestamp): Timestamp => {
  const date = new Date(timestamp)
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

const blogPostFormKey = (uuid?: UUID): string =>
  uuid ? `blog-post-form-${uuid}` : 'blog-post-form-new'

interface BlogPostFormFields {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  imageUrl: string
  image?: File
  publishedAt: Timestamp
  tags: Array<string>
  status: BlogPostStatus
  html: string
}

class NewBlogPostFormInitializer implements FormInitializer {
  private readonly key: string
  private readonly dateProvider: DateProvider
  private formStore: any

  constructor(key: string, dateProvider: DateProvider) {
    this.key = key
    this.dateProvider = dateProvider
    this.formStore = useFormStore()
  }

  init() {
    const fields: BlogPostFormFields = {
      slug: '',
      title: '',
      metaTitle: '',
      metaDescription: '',
      imageUrl: '',
      image: undefined,
      publishedAt: atUtcMidnight(this.dateProvider.now()),
      tags: [],
      status: BlogPostStatus.DRAFT,
      html: ''
    }
    this.formStore.set(this.key, fields)
  }
}

class ExistingBlogPostFormInitializer implements FormInitializer {
  private readonly key: string
  private formStore: any
  private blogPostStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.blogPostStore = useBlogPostStore()
  }

  init() {
    const blogPost = this.blogPostStore.current
    if (!blogPost) {
      throw new Error('No blog post found in store')
    }
    const copy = JSON.parse(JSON.stringify(blogPost))
    const fields: BlogPostFormFields = {
      slug: copy.slug,
      title: copy.title,
      metaTitle: copy.metaTitle ?? '',
      metaDescription: copy.metaDescription,
      imageUrl: copy.imageUrl,
      image: undefined,
      publishedAt: copy.publishedAt,
      tags: copy.tags,
      status: copy.status,
      html: copy.html
    }
    this.formStore.set(this.key, fields)
  }
}

type FieldSetter = (value: any) => void

export class BlogPostFormVM {
  private readonly fieldsReader: FormFieldsReader
  private readonly fieldsWriter: FormFieldsWriter
  private readonly isCreation: boolean
  private readonly initialFields: string
  private readonly initialStatus: BlogPostStatus
  private readonly setters: Record<string, FieldSetter> = {
    title: (value) => this.setTitle(value),
    publishedAt: (value) =>
      this.fieldsWriter.set('publishedAt', atUtcMidnight(value))
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

  addTag(tag: string): void {
    const trimmed = tag.trim()
    if (trimmed.length === 0) return
    const tags = this.tags()
    if (tags.includes(trimmed)) return
    if (tags.length >= BLOG_POST_MAX_TAGS) return
    this.fieldsWriter.set('tags', [...tags, trimmed])
  }

  removeTag(tag: string): void {
    this.fieldsWriter.set(
      'tags',
      this.tags().filter((current) => current !== tag)
    )
  }

  getCreateDto(): CreateBlogPostDTO {
    return {
      slug: this.text('slug'),
      ...this.contentDto()
    }
  }

  getEditDto(): EditBlogPostDTO {
    return this.contentDto()
  }

  getStatusTransition(): BlogPostStatus | undefined {
    const status = this.fieldsReader.get('status')
    if (status === this.initialStatus) return undefined
    return status
  }

  getPublicPath(): string {
    return `${BLOG_POST_PUBLIC_PREFIX}${this.text('slug')}`
  }

  getMetaDescriptionLength(): number {
    return this.text('metaDescription').length
  }

  getCanValidate(): boolean {
    return (
      this.isFilled('title') &&
      this.text('title').length <= BLOG_POST_MAX_TITLE_LENGTH &&
      this.text('metaTitle').length <= BLOG_POST_MAX_META_TITLE_LENGTH &&
      this.isFilled('metaDescription') &&
      this.getMetaDescriptionLength() <=
        BLOG_POST_MAX_META_DESCRIPTION_LENGTH &&
      this.isFilled('html') &&
      this.hasCoverImage() &&
      this.hasUsableSlug() &&
      this.fieldsReader.get('publishedAt') > 0
    )
  }

  private setTitle(title: string): void {
    const previousTitle = this.text('title')
    const previousSlug = this.text('slug')
    this.fieldsWriter.set('title', title)
    if (!this.isCreation) return
    if (previousSlug !== blogPostSlugFromTitle(previousTitle)) return
    this.fieldsWriter.set('slug', blogPostSlugFromTitle(title))
  }

  private contentDto() {
    const metaTitle = this.text('metaTitle')
    const imageUrl = this.text('imageUrl')
    return {
      title: this.text('title'),
      metaTitle: metaTitle.length > 0 ? metaTitle : undefined,
      metaDescription: this.text('metaDescription'),
      imageUrl: imageUrl.length > 0 ? imageUrl : undefined,
      image: this.fieldsReader.get('image'),
      publishedAt: this.fieldsReader.get('publishedAt'),
      tags: this.tags(),
      html: this.text('html')
    }
  }

  private hasCoverImage(): boolean {
    return (
      this.isFilled('imageUrl') || this.fieldsReader.get('image') !== undefined
    )
  }

  private hasUsableSlug(): boolean {
    return isValidBlogPostSlug(this.text('slug'))
  }

  private tags(): Array<string> {
    return this.fieldsReader.get('tags') ?? []
  }

  private text(fieldName: string): string {
    return this.fieldsReader.get(fieldName) ?? ''
  }

  private isFilled(fieldName: string): boolean {
    return this.text(fieldName).trim().length > 0
  }

  private snapshot(): string {
    const { image, ...content } = this.contentDto()
    return JSON.stringify({
      ...content,
      slug: this.text('slug'),
      status: this.fieldsReader.get('status'),
      imageName: image?.name
    })
  }
}

export const blogPostFormVM = (
  dateProvider: DateProvider,
  uuid?: UUID
): BlogPostFormVM => {
  const key = blogPostFormKey(uuid)
  const initializer = uuid
    ? new ExistingBlogPostFormInitializer(key)
    : new NewBlogPostFormInitializer(key, dateProvider)
  return new BlogPostFormVM(
    initializer,
    new FormFieldsReader(key),
    new FormFieldsWriter(key),
    uuid === undefined
  )
}
