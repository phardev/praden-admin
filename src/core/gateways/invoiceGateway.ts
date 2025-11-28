import { Invoice } from '@core/entities/invoice'
import { Order } from '@core/entities/order'

export interface InvoiceGateway {
  get(invoiceNumber: string): Promise<Invoice>
  create(order: Order): Promise<Invoice>
  downloadPdf(invoiceNumber: string): Promise<Blob>
}
