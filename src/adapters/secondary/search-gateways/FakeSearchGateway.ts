import { isProduct, Product } from '@core/entities/product'
import {
  SearchGateway,
  SearchProductsResult
} from '@core/gateways/searchGateway'
import '@utils/strings'
import { computeTotalWithTaxForOrder } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Customer } from '@core/entities/customer'
import {
  getDeliveryStatus,
  getOrderStatus,
  isAnonymousOrder,
  Order
} from '@core/entities/order'
import { Timestamp } from '@core/types/types'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import {
  SearchOrdersDTO,
  TotalTtcCondition
} from '@core/usecases/order/orders-searching/searchOrders'
import {
  PriceTtcCondition,
  SearchProductsFilters
} from '@core/usecases/product/product-searching/searchProducts'
import { useCustomerStore } from '@store/customerStore'
import { useOrderStore } from '@store/orderStore'
import { addTaxToPrice } from '@utils/price'

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
      const queryMatch = filters.query
        ? this.productQueryMatch(p, filters.query)
        : true
      const statusMatch = filters.status ? p.status === filters.status : true
      const priceTtcMatch = filters.priceTtcConditions?.length
        ? this.productPriceTtcMatch(p, filters.priceTtcConditions)
        : true
      return queryMatch && statusMatch && priceTtcMatch
    })
    const sorted = this.sortProducts(filtered, filters)
    const total = sorted.length
    const from = filters.from ?? 0
    const size = filters.size ?? 25
    const items = sorted.slice(from, from + size)
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

  private productQueryMatch = (product: any, query: string): boolean => {
    const isCategoryNameMatching = product.categories.some((c: any) =>
      c.name.includesWithoutCase(query)
    )
    const isNameMatching = product.name.includesWithoutCase(query)
    const isLaboratoryMatching = product.laboratory
      ? product.laboratory.name.includesWithoutCase(query)
      : false
    const isCip13Matching = product.cip13.includes(query)
    return (
      isNameMatching ||
      isLaboratoryMatching ||
      isCategoryNameMatching ||
      isCip13Matching
    )
  }

  private productPriceTtcMatch = (
    product: any,
    conditions: Array<PriceTtcCondition>
  ): boolean => {
    const priceWithTax = addTaxToPrice(
      product.priceWithoutTax,
      product.percentTaxRate
    )
    return conditions.every(({ operator, value }) => {
      if (operator === 'lte') return priceWithTax <= value
      if (operator === 'gte') return priceWithTax >= value
      return Math.abs(priceWithTax - value) < 1
    })
  }

  private sortProducts(
    products: Array<Product>,
    filters: SearchProductsFilters
  ): Array<Product> {
    if (!filters.sort) {
      return products
    }
    const { field, direction } = filters.sort
    const factor = direction === 'asc' ? 1 : -1
    return [...products].sort((a: any, b: any) => {
      const aValue = this.sortValue(a, field)
      const bValue = this.sortValue(b, field)
      const primary =
        typeof aValue === 'number' && typeof bValue === 'number'
          ? (aValue - bValue) * factor
          : String(aValue).localeCompare(String(bValue)) * factor
      return primary !== 0 ? primary : a.uuid.localeCompare(b.uuid)
    })
  }

  private sortValue(product: any, field: string): unknown {
    if (field === 'priceWithTax') {
      return addTaxToPrice(product.priceWithoutTax, product.percentTaxRate)
    }
    return product[field]
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
      const totalTtcMatch = dto.totalTtcConditions?.length
        ? this.ordersTotalTtcMatch(o, dto.totalTtcConditions)
        : true
      return (
        queryMatch &&
        dateMatch &&
        orderStatusMatch &&
        deliveryStatusMatch &&
        paymentStatusMatch &&
        customerUuidMatch &&
        totalTtcMatch
      )
    })
    const from = dto.from ?? 0
    const size = dto.size ?? res.length
    return Promise.resolve(res.slice(from, from + size))
  }

  private ordersQueryMatch = (order: Order, query: string): boolean => {
    const isReferenceMatching = order.uuid.includesWithoutCase(query)
    const fullName =
      order.deliveryAddress.firstname + ' ' + order.deliveryAddress.lastname
    const isClientNameMatching = fullName.includesWithoutCase(query)
    const email = isAnonymousOrder(order)
      ? order.contact.email
      : (order.deliveries?.[0]?.receiver?.contact?.email ?? '')
    const isEmailMatching = email ? email.includesWithoutCase(query) : false
    return isReferenceMatching || isClientNameMatching || isEmailMatching
  }

  private ordersTotalTtcMatch = (
    order: Order,
    conditions: Array<TotalTtcCondition>
  ): boolean => {
    const total = computeTotalWithTaxForOrder(order)
    return conditions.every(({ operator, value }) => {
      if (operator === 'lte') return total <= value
      if (operator === 'gte') return total >= value
      return Math.abs(total - value) < 1
    })
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
