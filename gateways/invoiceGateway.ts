import { InMemoryInvoiceGateway } from '@adapters/secondary/inMemoryInvoiceGateway'
import { RealDateProvider } from '@adapters/secondary/realDateProvider'
import { RealInvoiceGateway } from '@adapters/secondary/realInvoiceGateway'

export const useInvoiceGateway = () => {
  const invoiceGateway = new InMemoryInvoiceGateway(new RealDateProvider())
  return new RealInvoiceGateway('http://localhost:8787')
  return invoiceGateway
}
