import { CustomerGateway } from '@core/gateways/customerGateway'
import { NewsletterGateway } from '@core/gateways/newsletterGateway'
import { useCustomerStore } from '@store/customerStore'
import { useNewsletterStore } from '@store/newsletterStore'

export const unsubscribeFromNewsletter = async (
  email: string,
  newsletterGateway: NewsletterGateway,
  customerGateway: CustomerGateway
) => {
  const newsletterStore = useNewsletterStore()
  const unsubscribed = await newsletterGateway.unsubscribe(email)
  newsletterStore.remove(unsubscribed.uuid)
  if (unsubscribed.customerUuid) {
    const customerStore = useCustomerStore()
    const customer = await customerGateway.getByUuid(unsubscribed.customerUuid)
    delete customer.newsletterSubscription
    customerStore.add(customer)
  }
}
