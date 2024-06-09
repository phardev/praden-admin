import { InMemoryInvoiceGateway } from '@adapters/secondary/invoice-gateways/InMemoryInvoiceGateway'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import { RealInvoiceGateway } from '@adapters/secondary/invoice-gateways/RealInvoiceGateway'
import { isLocalEnv } from '@utils/env'

export const useInvoiceGateway = () => {
  if (isLocalEnv()) {
    const invoiceGateway = new InMemoryInvoiceGateway(new RealDateProvider())
    return invoiceGateway
  }
  const { BACKEND_URL } = useRuntimeConfig()
  return new RealInvoiceGateway(BACKEND_URL)
}
