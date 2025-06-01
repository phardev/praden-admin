import { InMemoryInvoiceGateway } from '@adapters/secondary/invoice-gateways/InMemoryInvoiceGateway'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import { isLocalEnv } from '@utils/env'
import { RealInvoiceGateway } from '@adapters/secondary/invoice-gateways/RealInvoiceGateway'
import * as invoices from '@utils/testData/invoices'

const gateway = new InMemoryInvoiceGateway(new RealDateProvider())
gateway.feedWith(...Object.values(invoices))

export const useInvoiceGateway = () => {
  if (isLocalEnv()) {
    return gateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealInvoiceGateway(BACKEND_URL)
}
