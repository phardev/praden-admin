import { SearchGateway } from '@core/gateways/searchGateway'
import { isProduct, Product } from '@core/entities/product'
import { isCategory } from '@core/entities/category'
import '@utils/strings'
import { getDeliveryStatus, Order } from '@core/entities/order'
import { useOrderStore } from '@store/orderStore'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { Timestamp } from '@core/types/types'

export class FakeSearchGateway implements SearchGateway {
  private items: Array<any> = []
  private orderStore: any

  constructor() {
    this.orderStore = useOrderStore()
  }

  searchProducts(query: string): Promise<Array<Product>> {
    const products = this.items.filter((i) => isProduct(i))
    const res = products.filter((i) => {
      const categories = this.items.filter((i) => isCategory(i))
      const category = categories.find((c) => c.uuid === i.categoryUuid)
      const isCategoryNameMatching = category
        ? category.name.includesWithoutCase(query)
        : false
      const isNameMatching = i.name.includesWithoutCase(query)
      const isLaboratoryMatching = i.laboratory.includesWithoutCase(query)
      const isCip13Matching = i.cip13.includes(query)
      return (
        isNameMatching ||
        isLaboratoryMatching ||
        isCategoryNameMatching ||
        isCip13Matching
      )
    })
    return Promise.resolve(res)
  }

  searchOrders(dto: SearchOrdersDTO): Promise<Array<Order>> {
    const orders = this.orderStore.items
    const res = orders.filter((o) => {
      const queryMatch = dto.query ? this.ordersQueryMatch(o, dto.query) : true
      const dateMatch = this.ordersDateMatch(
        o.createdAt,
        dto.startDate,
        dto.endDate
      )
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

  feedWith(...items: Array<any>) {
    this.items = items
  }
}
