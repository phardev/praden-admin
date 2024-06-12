import { InMemoryInvoiceGateway } from '@adapters/secondary/invoice-gateways/InMemoryInvoiceGateway'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'

export const useInvoiceGateway = () => {
  // if (isLocalEnv()) {
  return new InMemoryInvoiceGateway(new RealDateProvider())
  // }
  // const { BACKEND_URL } = useRuntimeConfig()
  // return new RealInvoiceGateway(BACKEND_URL)
}
