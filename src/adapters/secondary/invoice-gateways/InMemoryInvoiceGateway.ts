import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { Invoice } from '@core/entities/invoice'
import { Order } from '@core/entities/order'
import { DateProvider } from '@core/gateways/dateProvider'

export class InMemoryInvoiceGateway implements InvoiceGateway {
  private invoices: Array<Invoice> = []
  private dateProvider: DateProvider

  constructor(dateProvider: DateProvider) {
    this.dateProvider = dateProvider
  }

  get(invoiceNumber: string): Promise<Invoice> {
    const invoice = this.invoices.find(
      (invoice) => invoice.id === invoiceNumber
    )
    if (!invoice) {
      throw new Error(`Invoice ${invoiceNumber} not found`)
    }
    return Promise.resolve(invoice)
  }

  create(order: Order): Promise<Invoice> {
    const invoice: Invoice = {
      id: order.invoiceNumber!,
      data: order,
      createdAt: this.dateProvider.now()
    }
    this.invoices.push(invoice)
    return Promise.resolve(invoice)
  }

  feedWith(...invoices: Array<Invoice>) {
    this.invoices = invoices
  }
}
