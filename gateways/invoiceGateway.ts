import { InMemoryInvoiceGateway } from '@adapters/secondary/invoice-gateways/InMemoryInvoiceGateway'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import { isLocalEnv } from '@utils/env'
import { RealInvoiceGateway } from '@adapters/secondary/invoice-gateways/RealInvoiceGateway'

export const useInvoiceGateway = () => {
  if (isLocalEnv()) {
    return new InMemoryInvoiceGateway(new RealDateProvider())
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealInvoiceGateway(BACKEND_URL)
}
