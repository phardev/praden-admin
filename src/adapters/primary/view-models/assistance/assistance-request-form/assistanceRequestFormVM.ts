import {
  type FileSizeLabelVM,
  formatFileSize
} from '@adapters/primary/view-models/assistance/shared/fileSize'
import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  type FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  AssistanceRequestCategory,
  type AssistanceSubject,
  AssistanceSubjectType
} from '@core/entities/assistanceRequest'
import type { CreateAssistanceRequestDTO } from '@core/gateways/assistanceRequestGateway'
import { useFormStore } from '@store/formStore'
import { getFileContent } from '@utils/file'
import {
  type AssistanceAttachmentError,
  attachmentErrorFor,
  MAX_ATTACHMENT_SIZE_BYTES,
  MAX_ATTACHMENTS
} from './attachmentRules'

export {
  type AssistanceAttachmentError,
  MAX_ATTACHMENT_SIZE_BYTES,
  MAX_ATTACHMENTS
}

export interface AssistanceAttachmentVM {
  name: string
  size: number
  formattedSize: FileSizeLabelVM
  previewUrl: string
}

export interface AssistanceFormContext {
  pageSubject?: AssistanceSubject
  suggestedCategory?: AssistanceRequestCategory
}

export type AssistanceFormFieldName =
  | 'category'
  | 'subject'
  | 'description'
  | 'subjectQuery'

interface StoredAttachment extends AssistanceAttachmentVM {
  file: File
}

const subjectTypeFor = (
  category: AssistanceRequestCategory | undefined
): AssistanceSubjectType | undefined => {
  switch (category) {
    case AssistanceRequestCategory.ORDER:
    case AssistanceRequestCategory.DELIVERY:
      return AssistanceSubjectType.ORDER
    case AssistanceRequestCategory.PRODUCT:
      return AssistanceSubjectType.PRODUCT
    case AssistanceRequestCategory.CUSTOMER:
      return AssistanceSubjectType.CUSTOMER
    default:
      return undefined
  }
}

const toStoredAttachment = async (file: File): Promise<StoredAttachment> => ({
  file,
  name: file.name,
  size: file.size,
  formattedSize: formatFileSize(file.size),
  previewUrl: await getFileContent(file)
})

const toAttachmentVM = (
  attachment: StoredAttachment
): AssistanceAttachmentVM => ({
  name: attachment.name,
  size: attachment.size,
  formattedSize: attachment.formattedSize,
  previewUrl: attachment.previewUrl
})

class AssistanceFormInitializer implements FormInitializer {
  constructor(
    private readonly key: string,
    private readonly context: AssistanceFormContext
  ) {}

  init(): void {
    useFormStore().set(this.key, {
      category: this.context.suggestedCategory,
      subject: this.context.pageSubject,
      pageSubject: this.context.pageSubject,
      description: '',
      subjectQuery: '',
      attachments: [],
      attachmentError: undefined,
      changingSubject: false
    })
  }
}

export class AssistanceRequestFormVM {
  constructor(
    initializer: FormInitializer,
    private readonly fieldsReader: FormFieldsReader,
    private readonly fieldsWriter: FormFieldsWriter
  ) {
    initializer.init()
  }

  get(fieldName: AssistanceFormFieldName): Field<any> {
    return { value: this.fieldsReader.get(fieldName), canEdit: true }
  }

  async set(fieldName: AssistanceFormFieldName, value: any): Promise<void> {
    this.clearAttachmentError()
    if (fieldName === 'category') {
      this.setCategory(value)
      return
    }
    this.fieldsWriter.set(fieldName, value)
  }

  async addAttachments(files: Array<File>): Promise<void> {
    const existing = this.storedAttachments()
    const error = attachmentErrorFor(existing.length, files)
    this.fieldsWriter.set('attachmentError', error)
    if (error) return
    const added = await Promise.all(files.map(toStoredAttachment))
    this.fieldsWriter.set('attachments', [...existing, ...added])
  }

  removeAttachment(index: number): void {
    const attachments = this.storedAttachments().filter(
      (_, attachmentIndex) => attachmentIndex !== index
    )
    this.fieldsWriter.set('attachments', attachments)
    this.clearAttachmentError()
  }

  getAttachments(): Array<AssistanceAttachmentVM> {
    return this.storedAttachments().map(toAttachmentVM)
  }

  getAttachmentError(): AssistanceAttachmentError | undefined {
    return this.fieldsReader.get('attachmentError')
  }

  startChangingSubject(): void {
    this.fieldsWriter.set('changingSubject', true)
    this.fieldsWriter.set('subject', undefined)
  }

  isChangingSubject(): boolean {
    return this.fieldsReader.get('changingSubject')
  }

  needsSubject(): boolean {
    const category = this.category()
    return (
      !!category &&
      category !== AssistanceRequestCategory.OTHER &&
      !this.subject()
    )
  }

  subjectType(): AssistanceSubjectType | undefined {
    return subjectTypeFor(this.category())
  }

  isValid(): boolean {
    return !!this.category() && this.description().trim() !== ''
  }

  getDto(): CreateAssistanceRequestDTO {
    return {
      category: this.category() as AssistanceRequestCategory,
      subject: this.subject(),
      description: this.description().trim()
    }
  }

  getFiles(): Array<File> {
    return this.storedAttachments().map((attachment) => attachment.file)
  }

  private setCategory(category: AssistanceRequestCategory): void {
    if (subjectTypeFor(category) !== this.subjectType()) {
      this.fieldsWriter.set('subjectQuery', '')
    }
    this.fieldsWriter.set('category', category)
    this.fieldsWriter.set('subject', this.subjectFor(category))
  }

  private clearAttachmentError(): void {
    this.fieldsWriter.set('attachmentError', undefined)
  }

  private subjectFor(
    category: AssistanceRequestCategory
  ): AssistanceSubject | undefined {
    const type = subjectTypeFor(category)
    if (!type) return undefined
    const pageSubject = this.pageSubject()
    if (!this.isChangingSubject() && pageSubject?.type === type)
      return pageSubject
    const subject = this.subject()
    return subject?.type === type ? subject : undefined
  }

  private category(): AssistanceRequestCategory | undefined {
    return this.fieldsReader.get('category')
  }

  private subject(): AssistanceSubject | undefined {
    return this.fieldsReader.get('subject')
  }

  private pageSubject(): AssistanceSubject | undefined {
    return this.fieldsReader.get('pageSubject')
  }

  private description(): string {
    return this.fieldsReader.get('description') ?? ''
  }

  private storedAttachments(): Array<StoredAttachment> {
    return this.fieldsReader.get('attachments') ?? []
  }
}

export const assistanceRequestFormVM = (
  key: string,
  context: AssistanceFormContext
): AssistanceRequestFormVM =>
  new AssistanceRequestFormVM(
    new AssistanceFormInitializer(key, context),
    new FormFieldsReader(key),
    new FormFieldsWriter(key)
  )
