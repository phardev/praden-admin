import { InMemoryInvoiceGateway } from '@adapters/secondary/inMemoryInvoiceGateway'
import { RealDateProvider } from '@adapters/secondary/realDateProvider'

export const useInvoiceGateway = () => {
  const invoiceGateway = new InMemoryInvoiceGateway(new RealDateProvider())
  return invoiceGateway
}
