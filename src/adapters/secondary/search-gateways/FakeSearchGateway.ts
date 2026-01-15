import { isProduct, Product } from '@core/entities/product'
import {
  SearchGateway,
  SearchProductsResult
} from '@core/gateways/searchGateway'
import '@utils/strings'
import { Customer } from '@core/entities/customer'
import { getDeliveryStatus, getOrderStatus, Order } from '@core/entities/order'
import { Timestamp } from '@core/types/types'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { SearchProductsFilters } from '@core/usecases/product/product-searching/searchProducts'
import { useCustomerStore } from '@store/customerStore'
import { useOrderStore } from '@store/orderStore'

export class FakeSearchGateway implements SearchGateway {
  private items: Array<any> = []
  private orderStore: any
  private customerStore: any

  constructor() {
    this.orderStore = useOrderStore()
    this.customerStore = useCustomerStore()
  }

  searchProducts(
    filters: SearchProductsFilters
  ): Promise<SearchProductsResult> {
    const products = this.items.filter((i) => isProduct(i))
    const filtered = products.filter((p) => {
      if (filters.query) {
        const query = filters.query
        const isCategoryNameMatching = p.categories.some((c) =>
          c.name.includesWithoutCase(query)
        )
        const isNameMatching = p.name.includesWithoutCase(query)
        const isLaboratoryMatching = p.laboratory
          ? p.laboratory.name.includesWithoutCase(query)
          : false
        const isCip13Matching = p.cip13.includes(query)
        return (
          isNameMatching ||
          isLaboratoryMatching ||
          isCategoryNameMatching ||
          isCip13Matching
        )
      }
      if (filters.status) {
        return p.status === filters.status
      }
    })
    const total = filtered.length
    const from = filters.from ?? 0
    const size = filters.size ?? 25
    const items = filtered.slice(from, from + size)
    const page = Math.floor(from / size) + 1
    const totalPages = Math.ceil(total / size)
    const hasMore = items.length === size && total > from + size
    return Promise.resolve({
      items,
      pagination: {
        total,
        page,
        pageSize: size,
        totalPages
      },
      hasMore
    })
  }

  indexProducts(limit: number, offset: number): Promise<number> {
    console.log(`index ${limit} products from: ${offset}`)
    return Promise.resolve(limit)
  }

  searchOrders(dto: SearchOrdersDTO): Promise<Array<Order>> {
    const orders = this.orderStore.items
    const res = orders.filter((o: any) => {
      const queryMatch = dto.query ? this.ordersQueryMatch(o, dto.query) : true
      const dateMatch = this.ordersDateMatch(
        o.createdAt,
        dto.startDate,
        dto.endDate
      )
      const orderStatusMatch =
        dto.orderStatus !== undefined
          ? dto.orderStatus === getOrderStatus(o)
          : true
      const deliveryStatusMatch =
        dto.deliveryStatus !== undefined
          ? dto.deliveryStatus === getDeliveryStatus(o)
          : true
      const paymentStatusMatch =
        dto.paymentStatus !== undefined
          ? dto.paymentStatus === o.payment.status
          : true
      const customerUuidMatch =
        dto.customerUuid !== undefined
          ? dto.customerUuid === o.customerUuid
          : true
      return (
        queryMatch &&
        dateMatch &&
        orderStatusMatch &&
        deliveryStatusMatch &&
        paymentStatusMatch &&
        customerUuidMatch
      )
    })
    return Promise.resolve(res)
  }

  private ordersQueryMatch = (order: Order, query: string): boolean => {
    const isReferenceMatching = order.uuid.includesWithoutCase(query)
    const fullName =
      order.deliveryAddress.firstname + ' ' + order.deliveryAddress.lastname
    const isClientNameMatching = fullName.includesWithoutCase(query)
    return isReferenceMatching || isClientNameMatching
  }

  private ordersDateMatch = (
    orderDate: Timestamp,
    startDate: Timestamp | undefined,
    endDate: Timestamp | undefined
  ): boolean => {
    const isAfterStartDate = !startDate ? true : orderDate > startDate
    const isAfterEndDate = !endDate ? true : orderDate < endDate
    return isAfterStartDate && isAfterEndDate
  }

  searchCustomers(dto: SearchCustomersDTO): Promise<Array<Customer>> {
    const customers = this.customerStore.items
    if (!dto.query) {
      return Promise.resolve(customers)
    }
    const res = customers.filter((c: Customer) => {
      return this.customerQueryMatch(c, dto.query!)
    })
    return Promise.resolve(res)
  }

  private customerQueryMatch = (customer: Customer, query: string): boolean => {
    const isFirstNameMatching = customer.firstname
      .ftNormalize()
      .includesWithoutCase(query)
    const isLastNameMatching = customer.lastname
      .ftNormalize()
      .includesWithoutCase(query)
    const isEmailMatching = customer.email.includes(query)
    const isPhoneMatching = customer.phone.includes(query)
    return (
      isFirstNameMatching ||
      isLastNameMatching ||
      isEmailMatching ||
      isPhoneMatching
    )
  }

  feedWith(...items: Array<any>) {
    this.items = items
  }
}
