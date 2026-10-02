import { getSelectedEmailColumn } from '@core/entities/newsletterUnsubscriptionImport'
import type { NewsletterGateway } from '@core/gateways/newsletterGateway'
import { useNewsletterStore } from '@store/newsletterStore'

export const UNSUBSCRIPTION_BATCH_SIZE = 500

const batchesOf = (emails: Array<string>): Array<Array<string>> =>
  Array.from(
    { length: Math.ceil(emails.length / UNSUBSCRIPTION_BATCH_SIZE) },
    (_, index) =>
      emails.slice(
        index * UNSUBSCRIPTION_BATCH_SIZE,
        (index + 1) * UNSUBSCRIPTION_BATCH_SIZE
      )
  )

export const unsubscribeManyFromNewsletter = async (
  newsletterGateway: NewsletterGateway
) => {
  const newsletterStore = useNewsletterStore()
  const unsubscriptionImport = newsletterStore.unsubscriptionImport
  const emails = unsubscriptionImport
    ? (getSelectedEmailColumn(unsubscriptionImport)?.emails ?? [])
    : []
  if (emails.length === 0) return
  newsletterStore.startUnsubscribing(emails.length)
  try {
    for (const batch of batchesOf(emails)) {
      const unsubscribedCount = await newsletterGateway.unsubscribeMany(batch)
      newsletterStore.addUnsubscriptionProgress(batch.length, unsubscribedCount)
    }
    newsletterStore.list(await newsletterGateway.list())
  } finally {
    newsletterStore.stopUnsubscribing()
  }
}
