import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Customer } from '@core/entities/customer'
import { DeliveryStatus } from '@core/entities/delivery'
import {
  getOrderStatus,
  Order,
  OrderLine,
  OrderLineStatus,
  PaymentStatus
} from '@core/entities/order'
import { Product } from '@core/entities/product'
import { SearchGateway } from '@core/gateways/searchGateway'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { SearchProductsFilters } from '@core/usecases/product/product-searching/searchProducts'
import { useLocationStore } from '@store/locationStore'
import { useOrderStore } from '@store/orderStore'

export class RealSearchGateway extends RealGateway implements SearchGateway {
  constructor(url: string) {
    super(url)
  }

  async searchProducts(
    filters: SearchProductsFilters
  ): Promise<Array<Product>> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/search/products`,
      filters
    )
    return Promise.resolve(
      res.data.items.sort(
        (a: Product, b: Product) => b.availableStock - a.availableStock
      )
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
    const paymentStatusMap = {
      [PaymentStatus.WaitingForPayment]: 'WAITINGFORPAYMENT',
      [PaymentStatus.Payed]: 'PAYED',
      [PaymentStatus.Rejected]: 'REJECTED'
    }
    const deliveryStatusMap = {
      [DeliveryStatus.Created]: 'CREATED',
      [DeliveryStatus.Prepared]: 'PREPARED',
      [DeliveryStatus.Shipped]: 'SHIPPED',
      [DeliveryStatus.Delivered]: 'DELIVERED'
    }

    const body = {
      startDate: dto.startDate,
      endDate: dto.endDate,
      paymentStatus:
        dto.paymentStatus !== undefined
          ? paymentStatusMap[dto.paymentStatus]
          : undefined,
      customerUuid: dto.customerUuid,
      deliveryStatus: dto.deliveryStatus
        ? deliveryStatusMap[dto.deliveryStatus]
        : undefined
    }
    const orderStore = useOrderStore()
    let orders = orderStore.items
    if (
      body.startDate ||
      body.endDate ||
      body.paymentStatus !== undefined ||
      body.deliveryStatus !== undefined ||
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
      orderStatus: dto.orderStatus
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
    if (filters.orderStatus) {
      if (!this.applyOrderStatusFilter(order, filters.orderStatus)) {
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

  private applyOrderStatusFilter(
    order: Order,
    orderStatus: OrderLineStatus
  ): boolean {
    return getOrderStatus(order) === orderStatus
  }

  async searchCustomers(dto: SearchCustomersDTO): Promise<Array<Customer>> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/search/customers`,
      dto
    )
    return res.data
  }

  private getZoneGeoUuid(): string {
    const locationStore = useLocationStore()
    const sortedLocations = [...locationStore.items].sort(
      (a, b) => a.order - b.order
    )
    return sortedLocations[0]?.uuid ?? ''
  }

  private convertToOrder(data: any): Order {
    const zoneGeoUuid = this.getZoneGeoUuid()
    const copy = JSON.parse(JSON.stringify(data))
    copy.lines = copy.lines.map((l: any) => {
      const res: OrderLine = {
        productUuid: l.productUuid,
        ean13: l.ean13,
        expectedQuantity: l.expectedQuantity,
        name: l.name,
        percentTaxRate: l.percentTaxRate,
        preparedQuantity: l.preparedQuantity,
        unitAmount: l.priceWithoutTax,
        status: this.getOrderLineStatus(l.status),
        locations: { [zoneGeoUuid]: l.location },
        updatedAt: l.updatedAt
      }
      return res
    })
    copy.deliveries = copy.deliveries.map((d: any) => {
      return {
        ...d,
        status: this.getDeliveryStatus(d.status)
      }
    })
    copy.lines.forEach((l: any) => {
      delete l.img
      delete l.description
      delete l.location
    })
    copy.messages = data.messages
      .sort((m1: any, m2: any) => m1.updatedAt - m2.updatedAt)
      .map((m: any) => {
        return {
          content: m.data.type,
          sentAt: m.updatedAt
        }
      })
    if (copy.payment) {
      copy.payment.status = this.getPaymentStatus(copy.payment.status)
    }
    return copy
  }
  private getOrderLineStatus(status: string): OrderLineStatus {
    if (status === 'CREATED') return OrderLineStatus.Created
    if (status === 'STARTED') return OrderLineStatus.Started
    if (status === 'PREPARED') return OrderLineStatus.Prepared
    if (status === 'CANCELED') return OrderLineStatus.Canceled
    return OrderLineStatus.Created
  }

  private getDeliveryStatus(status: string): DeliveryStatus {
    if (status === 'CREATED') return DeliveryStatus.Created
    if (status === 'PREPARED') return DeliveryStatus.Prepared
    if (status === 'SHIPPED') return DeliveryStatus.Shipped
    if (status === 'DELIVERED') return DeliveryStatus.Delivered
    return DeliveryStatus.Created
  }

  private getPaymentStatus(status: string): PaymentStatus {
    if (status === 'WAITINGFORPAYMENT') return PaymentStatus.WaitingForPayment
    if (status === 'PAYED') return PaymentStatus.Payed
    if (status === 'REJECTED') return PaymentStatus.Rejected
    return PaymentStatus.WaitingForPayment
  }
}
