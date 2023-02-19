import { InMemoryInvoiceGateway } from '@adapters/secondary/inMemoryInvoiceGateway'

export const useInvoiceGateway = () => {
  const invoiceGateway = new InMemoryInvoiceGateway()
  return invoiceGateway
}
