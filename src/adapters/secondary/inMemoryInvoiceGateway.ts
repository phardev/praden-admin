import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { Invoice } from '@core/entities/invoice'
import { Order } from '@core/entities/order'

export class InMemoryInvoiceGateway implements InvoiceGateway {
  private invoices: Array<Invoice> = []

  get(invoiceNumber: string): Promise<Invoice> {
    const invoice = this.invoices.find(
      (invoice) => invoice.id === invoiceNumber
    )
    return Promise.resolve(invoice)
  }

  create(order: Order): Promise<Invoice> {
    const invoice: Invoice = {
      id: order.payment.invoiceNumber,
      data: order
    }
    this.invoices.push(invoice)
    return Promise.resolve(invoice)
  }
}
