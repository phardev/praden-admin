import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryNewsletterGateway } from '@adapters/secondary/newsletter-gateways/inMemoryNewsletterGateway'
import { RealNewsletterGateway } from '@adapters/secondary/newsletter-gateways/realNewsletterGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as subcriptions from '@utils/testData/newsletterSubscriptions'

const uuidGenerator = new FakeUuidGenerator()
const dateProvider = new FakeDateProvider()
const newsletterGateway = new InMemoryNewsletterGateway(
  uuidGenerator,
  dateProvider
)
newsletterGateway.feedWith(...Object.values(subcriptions))

export const useNewsletterGateway = () => {
  if (isLocalEnv()) {
    return newsletterGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealNewsletterGateway(BACKEND_URL)
}
