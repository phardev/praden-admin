export interface EmailColumn {
  position: number
  name?: string
  emails: Array<string>
}

export interface NewsletterUnsubscriptionProgress {
  submittedCount: number
  processedCount: number
  unsubscribedCount: number
}

export interface NewsletterUnsubscriptionImport {
  fileName: string
  columns: Array<EmailColumn>
  selectedPosition?: number
  isUnsubscribing: boolean
  progress?: NewsletterUnsubscriptionProgress
}

export const getSelectedEmailColumn = (
  unsubscriptionImport: NewsletterUnsubscriptionImport
): EmailColumn | undefined =>
  unsubscriptionImport.columns.find(
    (column) => column.position === unsubscriptionImport.selectedPosition
  )

export const isUnsubscriptionComplete = (
  unsubscriptionImport: NewsletterUnsubscriptionImport
): boolean =>
  unsubscriptionImport.progress !== undefined &&
  unsubscriptionImport.progress.processedCount ===
    unsubscriptionImport.progress.submittedCount
