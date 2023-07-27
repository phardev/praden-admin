import { InMemoryInvoiceGateway } from '@adapters/secondary/inMemoryInvoiceGateway'
import { RealDateProvider } from '@adapters/secondary/realDateProvider'
import { RealInvoiceGateway } from '@adapters/secondary/realInvoiceGateway'

export const useInvoiceGateway = () => {
  const invoiceGateway = new InMemoryInvoiceGateway(new RealDateProvider())
  const { BACKEND_URL } = useRuntimeConfig()
  return new RealInvoiceGateway(BACKEND_URL)
  return invoiceGateway
}
