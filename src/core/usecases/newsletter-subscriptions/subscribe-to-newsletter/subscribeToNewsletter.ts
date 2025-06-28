import { CustomerGateway } from '@core/gateways/customerGateway'
import { NewsletterGateway } from '@core/gateways/newsletterGateway'
import { useCustomerStore } from '@store/customerStore'
import { useNewsletterStore } from '@store/newsletterStore'

export interface SubscribeToNewsletterDTO {
  email: string
  customerUuid?: string
}

export const subscribeToNewsletter = async (
  dto: SubscribeToNewsletterDTO,
  newsletterGateway: NewsletterGateway,
  customerGateway: CustomerGateway
) => {
  const newsletterStore = useNewsletterStore()
  try {
    newsletterStore.startLoading()
    const subscription = await newsletterGateway.subscribe(dto)
    newsletterStore.add(subscription)
    if (subscription.customerUuid) {
      const customer = await customerGateway.getByUuid(
        subscription.customerUuid
      )
      const customerStore = useCustomerStore()
      customer.newsletterSubscription = subscription
      customerStore.add(customer)
    }
  } finally {
    newsletterStore.stopLoading()
  }
}
