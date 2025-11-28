import { Invoice } from '@core/entities/invoice'
import { Order } from '@core/entities/order'
import { DateProvider } from '@core/gateways/dateProvider'
import { InvoiceGateway } from '@core/gateways/invoiceGateway'

export class InMemoryInvoiceGateway implements InvoiceGateway {
  private invoices: Array<Invoice> = []
  private dateProvider: DateProvider
  private pdfBlobs: Map<string, Blob> = new Map()

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

  downloadPdf(invoiceNumber: string): Promise<Blob> {
    const blob = this.pdfBlobs.get(invoiceNumber)
    if (blob) {
      return Promise.resolve(blob)
    }
    return Promise.resolve(
      new Blob([`Mock PDF content for invoice ${invoiceNumber}`], {
        type: 'application/pdf'
      })
    )
  }

  feedWith(...invoices: Array<Invoice>) {
    this.invoices = invoices
  }

  feedPdfBlobFor(invoiceNumber: string, blob: Blob) {
    this.pdfBlobs.set(invoiceNumber, blob)
  }
}
