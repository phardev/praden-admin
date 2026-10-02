import { InMemoryFooterGateway } from '@adapters/secondary/footer-gateways/inMemoryFooterGateway'
import { RealFooterGateway } from '@adapters/secondary/footer-gateways/realFooterGateway'
import { isLocalEnv } from '@utils/env'
import { footer } from '@utils/testData/footer'

const footerGateway = new InMemoryFooterGateway()
footerGateway.feedWith(footer)

export const useFooterGateway = () => {
  if (isLocalEnv()) {
    return footerGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealFooterGateway(BACKEND_URL)
}
