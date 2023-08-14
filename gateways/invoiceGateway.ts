import { InMemoryInvoiceGateway } from '@adapters/secondary/InMemoryInvoiceGateway'
import { RealDateProvider } from '@adapters/secondary/RealDateProvider'

export const useInvoiceGateway = () => {
  const invoiceGateway = new InMemoryInvoiceGateway(new RealDateProvider())
  // const { BACKEND_URL } = useRuntimeConfig()
  // return new RealInvoiceGateway(BACKEND_URL)
  return invoiceGateway
}
