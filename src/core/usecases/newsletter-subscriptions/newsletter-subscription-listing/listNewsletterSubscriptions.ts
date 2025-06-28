import { NewsletterGateway } from '@core/gateways/newsletterGateway'
import { useNewsletterStore } from '@store/newsletterStore'

export const listNewsletterSubscriptions = async (
  newsletterGateway: NewsletterGateway
) => {
  const newsletterStore = useNewsletterStore()
  try {
    newsletterStore.startLoading()
    const subscriptions = await newsletterGateway.list()
    newsletterStore.list(subscriptions)
  } finally {
    newsletterStore.stopLoading()
  }
}
