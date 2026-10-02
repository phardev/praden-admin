import {
  type EmailColumn,
  getSelectedEmailColumn,
  isUnsubscriptionComplete,
  type NewsletterUnsubscriptionImport
} from '@core/entities/newsletterUnsubscriptionImport'
import { useNewsletterStore } from '@store/newsletterStore'

export const EMAILS_SAMPLE_SIZE = 3
const MIN_EMAILS_TO_OFFER_COLUMN = 2

export interface NewsletterUnsubscriptionColumnVM {
  position: number
  name: string | undefined
  emailsCount: number
}

export interface NewsletterUnsubscriptionResultVM {
  unsubscribedCount: number
  notSubscribedCount: number
}

export interface GetNewsletterUnsubscriptionImportVM {
  isStarted: boolean
  fileName: string
  hasNoEmail: boolean
  columns: Array<NewsletterUnsubscriptionColumnVM>
  canChooseColumn: boolean
  selectedPosition: number | undefined
  emailsCount: number
  emailsSample: Array<string>
  otherEmailsCount: number
  isUnsubscribing: boolean
  processedCount: number
  canUnsubscribe: boolean
  result: NewsletterUnsubscriptionResultVM | undefined
}

const notStartedVM = (): GetNewsletterUnsubscriptionImportVM => ({
  isStarted: false,
  fileName: '',
  hasNoEmail: false,
  columns: [],
  canChooseColumn: false,
  selectedPosition: undefined,
  emailsCount: 0,
  emailsSample: [],
  otherEmailsCount: 0,
  isUnsubscribing: false,
  processedCount: 0,
  canUnsubscribe: false,
  result: undefined
})

const isWorthOffering =
  (unsubscriptionImport: NewsletterUnsubscriptionImport) =>
  (column: EmailColumn): boolean =>
    column.emails.length >= MIN_EMAILS_TO_OFFER_COLUMN ||
    column.position === unsubscriptionImport.selectedPosition

export const getNewsletterUnsubscriptionImportVM =
  (): GetNewsletterUnsubscriptionImportVM => {
    const unsubscriptionImport = useNewsletterStore().unsubscriptionImport
    if (!unsubscriptionImport) return notStartedVM()
    const { columns, isUnsubscribing, progress } = unsubscriptionImport
    const isComplete = isUnsubscriptionComplete(unsubscriptionImport)
    const emails = getSelectedEmailColumn(unsubscriptionImport)?.emails ?? []
    const emailsSample = emails.slice(0, EMAILS_SAMPLE_SIZE)
    const offeredColumns = columns.filter(isWorthOffering(unsubscriptionImport))
    return {
      isStarted: true,
      fileName: unsubscriptionImport.fileName,
      hasNoEmail: columns.length === 0,
      columns: offeredColumns.map((column) => ({
        position: column.position,
        name: column.name,
        emailsCount: column.emails.length
      })),
      canChooseColumn: offeredColumns.length > 1,
      selectedPosition: unsubscriptionImport.selectedPosition,
      emailsCount: emails.length,
      emailsSample,
      otherEmailsCount: emails.length - emailsSample.length,
      isUnsubscribing,
      processedCount: progress?.processedCount ?? 0,
      canUnsubscribe: emails.length > 0 && !isUnsubscribing && !isComplete,
      result:
        progress && isComplete
          ? {
              unsubscribedCount: progress.unsubscribedCount,
              notSubscribedCount:
                progress.submittedCount - progress.unsubscribedCount
            }
          : undefined
    }
  }
