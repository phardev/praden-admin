import { useNewsletterStore } from '@store/newsletterStore'

export const selectNewsletterUnsubscriptionColumn = (position: number) => {
  useNewsletterStore().selectUnsubscriptionColumn(position)
}
