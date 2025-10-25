import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { Invoice } from '@core/entities/invoice'
import {
  Order,
  OrderLine,
  OrderLineStatus,
  PaymentStatus
} from '@core/entities/order'
import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { zoneGeo } from '@utils/testData/locations'

export class RealInvoiceGateway implements InvoiceGateway {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = `${baseUrl}`
  }

  async get(invoiceNumber: string): Promise<Invoice> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/invoices/${encodeURIComponent(invoiceNumber)}`
    )
    return this.convertToInvoice(res.data)
  }

  async create(order: Order): Promise<Invoice> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/invoices`,
      JSON.stringify({
        orderUuid: order.uuid
      })
    )
    return this.convertToInvoice(res.data)
  }

  private convertToInvoice(data: any): Invoice {
    return {
      id: data.invoiceNumber,
      data: this.convertToOrder(data.data),
      createdAt: data.createdAt
    }
  }

  private convertToOrder(data: any): Order {
    const copy = typeof data === 'string' ? JSON.parse(data) : data
    copy.lines = copy.lines.map((l: any) => {
      const res: OrderLine = {
        productUuid: l.productUuid,
        ean13: l.ean13,
        expectedQuantity: l.expectedQuantity,
        name: l.name,
        percentTaxRate: l.percentTaxRate,
        preparedQuantity: l.preparedQuantity,
        unitAmount: l.priceWithoutTax,
        status: this.getDeliveryStatus(l.deliveryStatus),
        locations: { [zoneGeo.uuid]: l.location },
        updatedAt: l.updatedAt
      }
      return res
    })
    copy.lines.forEach((l: any) => {
      delete l.img
      delete l.description
      delete l.location
    })
    if (copy.payment) {
      copy.payment.status = this.getPaymentStatus(copy.payment.status)
    }
    return copy
  }
  private getDeliveryStatus(status: string): OrderLineStatus {
    if (status === 'CREATED') return OrderLineStatus.Created
    if (status === 'PROCESSING') return OrderLineStatus.Started
    if (status === 'SHIPPED') return OrderLineStatus.Prepared
    if (status === 'CANCELED') return OrderLineStatus.Canceled
    return OrderLineStatus.Created
  }

  private getPaymentStatus(status: string): PaymentStatus {
    if (status === 'WAITINGFORPAYMENT') return PaymentStatus.WaitingForPayment
    if (status === 'PAYED') return PaymentStatus.Payed
    if (status === 'REJECTED') return PaymentStatus.Rejected
    return PaymentStatus.WaitingForPayment
  }
}
