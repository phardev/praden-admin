import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Customer } from '@core/entities/customer'
import {
  DeliveryStatus,
  Order,
  OrderLine,
  PaymentStatus
} from '@core/entities/order'
import { Product } from '@core/entities/product'
import { SearchGateway } from '@core/gateways/searchGateway'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { zoneGeo } from '@utils/testData/locations'

export class RealSearchGateway extends RealGateway implements SearchGateway {
  constructor(url: string) {
    super(url)
  }

  async searchProducts(query: string): Promise<Array<Product>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/search/products`, {
      params: { query }
    })
    return Promise.resolve(res.data.items)
  }

  async indexProducts(limit: number, offset: number): Promise<number> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/products/index`, {
      limit,
      offset
    })
    return Promise.resolve(res.data.length)
  }

  async searchOrders(dto: SearchOrdersDTO): Promise<Array<Order>> {
    const deliveryStatusMap = {
      [DeliveryStatus.Created]: 'CREATED',
      [DeliveryStatus.Processing]: 'PROCESSING',
      [DeliveryStatus.Shipped]: 'SHIPPED',
      [DeliveryStatus.Canceled]: 'CANCELED'
    }
    const paymentStatusMap = {
      [PaymentStatus.WaitingForPayment]: 'WAITINGFORPAYMENT',
      [PaymentStatus.Payed]: 'PAYED'
    }
    const body = {
      ...dto,
      deliveryStatus: deliveryStatusMap[dto.deliveryStatus],
      paymentStatus: paymentStatusMap[dto.paymentStatus]
    }
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/search/orders`,
      body
    )
    return res.data.items.map((d: any) => {
      return this.convertToOrder(d)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchCustomers(dto: SearchCustomersDTO): Promise<Array<Customer>> {
    throw new Error('Method not implemented.')
  }

  private convertToOrder(data: any): Order {
    const copy = JSON.parse(JSON.stringify(data))
    delete copy.payment.sessionUrl
    copy.lines = copy.lines.map((l: any) => {
      const res: OrderLine = {
        productUuid: l.productUuid,
        ean13: l.ean13,
        expectedQuantity: l.expectedQuantity,
        name: l.name,
        percentTaxRate: l.percentTaxRate,
        preparedQuantity: l.preparedQuantity,
        unitAmount: l.priceWithoutTax,
        deliveryStatus: this.getDeliveryStatus(l.deliveryStatus),
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
    copy.messages = data.messages
      .sort((m1, m2) => m1.updatedAt - m2.updatedAt)
      .map((m: any) => {
        return {
          content: m.data.type,
          sentAt: m.updatedAt
        }
      })
    copy.payment.status = this.getPaymentStatus(copy.payment.status)
    return copy
  }
  private getDeliveryStatus(status: string): DeliveryStatus {
    if (status === 'CREATED') return DeliveryStatus.Created
    if (status === 'PROCESSING') return DeliveryStatus.Processing
    if (status === 'SHIPPED') return DeliveryStatus.Shipped
    if (status === 'DELIVERED') return DeliveryStatus.Delivered
    if (status === 'CANCELED') return DeliveryStatus.Canceled
    return DeliveryStatus.Created
  }

  private getPaymentStatus(status: string): PaymentStatus {
    if (status === 'WAITINGFORPAYMENT') return PaymentStatus.WaitingForPayment
    if (status === 'PAYED') return PaymentStatus.Payed
    return PaymentStatus.WaitingForPayment
  }
}
