import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { useInvoiceStore } from '@store/invoiceStore'

export const getInvoice = async (
  invoiceNumber: string,
  invoiceGateway: InvoiceGateway
) => {
  const invoice = await invoiceGateway.get(invoiceNumber)
  const invoiceStore = useInvoiceStore()
  invoiceStore.set(invoice)
}
