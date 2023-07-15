import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { Invoice } from '@core/entities/invoice'
import { Order } from '@core/entities/order'
import axios from 'axios'

export class RealInvoiceGateway implements InvoiceGateway {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = `${baseUrl}`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(invoiceNumber: string): Promise<Invoice> {
    throw Error('Not Implemented')
  }

  async create(order: Order): Promise<Invoice> {
    const res = await axios.post(
      `${this.baseUrl}/create-invoice/`,
      JSON.stringify({
        orderUuid: order.uuid
      })
    )
    const data = res.data
    data.id = data.uuid
    return Promise.resolve(data)
  }
}
