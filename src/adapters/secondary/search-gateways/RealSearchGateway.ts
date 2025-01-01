import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Customer } from '@core/entities/customer'
import {
  OrderLineStatus,
  getDeliveryStatus,
  Order,
  OrderLine,
  PaymentStatus
} from '@core/entities/order'
import { Product } from '@core/entities/product'
import { SearchGateway } from '@core/gateways/searchGateway'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { useOrderStore } from '@store/orderStore'
import { zoneGeo } from '@utils/testData/locations'

export class RealSearchGateway extends RealGateway implements SearchGateway {
  constructor(url: string) {
    super(url)
  }

  async searchProducts(query: string): Promise<Array<Product>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/search/products`, {
      params: { query }
    })
    return Promise.resolve(
      res.data.items.sort((a, b) => b.availableStock - a.availableStock)
    )
  }

  async indexProducts(limit: number, offset: number): Promise<number> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/products/index`, {
      limit,
      offset
    })
    return Promise.resolve(res.data.length)
  }

  async searchOrders(dto: SearchOrdersDTO): Promise<Array<Order>> {
    // const deliveryStatusMap = {
    //   [DeliveryStatus.Created]: 'CREATED',
    //   [DeliveryStatus.Processing]: 'PROCESSING',
    //   [DeliveryStatus.Shipped]: 'SHIPPED',
    //   [DeliveryStatus.Canceled]: 'CANCELED'
    // }
    const paymentStatusMap = {
      [PaymentStatus.WaitingForPayment]: 'WAITINGFORPAYMENT',
      [PaymentStatus.Payed]: 'PAYED',
      [PaymentStatus.Rejected]: 'REJECTED'
    }
    const body = {
      startDate: dto.startDate,
      endDate: dto.endDate,
      paymentStatus: paymentStatusMap[dto.paymentStatus],
      customerUuid: dto.customerUuid
    }
    const orderStore = useOrderStore()
    let orders = orderStore.items
    if (
      body.startDate ||
      body.endDate ||
      body.paymentStatus ||
      body.customerUuid
    ) {
      const res = await axiosWithBearer.post(
        `${this.baseUrl}/search/orders`,
        body
      )
      orders = res.data.items.map((d: any) => {
        return this.convertToOrder(d)
      })
    }
    let query: string | undefined = undefined
    if (dto.query && dto.query.length) {
      query = dto.query
    }
    const localFilters: SearchOrdersDTO = {
      query,
      deliveryStatus: dto.deliveryStatus
    }
    const filteredOrders = orders.filter((order) =>
      this.applyOrderFilters(order, localFilters)
    )
    return Promise.resolve(filteredOrders)
  }

  private applyOrderFilters(order: Order, filters: SearchOrdersDTO): boolean {
    if (filters.query) {
      if (!this.applyQueryFilters(order, filters.query)) {
        return false
      }
    }
    if (filters.deliveryStatus) {
      if (!this.applyDeliveryStatusFilter(order, filters.deliveryStatus)) {
        return false
      }
    }
    return true
  }

  private applyQueryFilters(order: Order, query: string): boolean {
    const normalize = (str: string): string =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics

    const queryNormalized = normalize(query)

    const queryRegex = new RegExp(queryNormalized, 'i')
    const fullname = `${order.deliveryAddress.firstname} ${order.deliveryAddress.lastname}`
    const reversedFullname = `${order.deliveryAddress.lastname} ${order.deliveryAddress.firstname}`
    const fullnameNormalized = normalize(fullname)
    const reversedFullnameNormalized = normalize(reversedFullname)
    return !(
      !queryRegex.test(order.uuid) &&
      !queryRegex.test(fullnameNormalized) &&
      !queryRegex.test(reversedFullnameNormalized)
    )
  }

  private applyDeliveryStatusFilter(
    order: Order,
    deliveryStatus: OrderLineStatus
  ): boolean {
    return getDeliveryStatus(order) === deliveryStatus
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
  private getDeliveryStatus(status: string): OrderLineStatus {
    if (status === 'CREATED') return OrderLineStatus.Created
    if (status === 'PROCESSING') return OrderLineStatus.Started
    if (status === 'SHIPPED') return OrderLineStatus.Prepared
    if (status === 'DELIVERED') return OrderLineStatus.Delivered
    if (status === 'CANCELED') return OrderLineStatus.Canceled
    return OrderLineStatus.Created
  }

  private getPaymentStatus(status: string): PaymentStatus {
    if (status === 'WAITINGFORPAYMENT') return PaymentStatus.WaitingForPayment
    if (status === 'PAYED') return PaymentStatus.Payed
    return PaymentStatus.WaitingForPayment
  }
}
