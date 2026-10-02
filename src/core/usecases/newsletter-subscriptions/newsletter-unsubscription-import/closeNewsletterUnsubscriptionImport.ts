import { useNewsletterStore } from '@store/newsletterStore'

export const closeNewsletterUnsubscriptionImport = () => {
  useNewsletterStore().clearUnsubscriptionImport()
}
