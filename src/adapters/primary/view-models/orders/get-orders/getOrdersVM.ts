import { DeliveryStatus } from '@core/entities/delivery'
import {
  getDeliveryStatus,
  getOrderStatus,
  isAnonymousOrder,
  Order,
  OrderLineStatus,
  PaymentStatus
} from '@core/entities/order'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { useOrderStore } from '@store/orderStore'
import { useSearchStore } from '@store/searchStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import {
  computeTotalWithTaxForOrder,
  Header
} from '../../preparations/get-orders-to-prepare/getPreparationsVM'

export interface GetOrdersItemVM {
  reference: string
  href: string
  client: string
  email: string
  createdDate: string
  createdDatetime: Date
  status: OrderLineStatus
  total: string
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
}

export interface GetOrdersVM {
  headers: Array<Header>
  items: Array<GetOrdersItemVM>
  isLoading: boolean
  hasMore: boolean
  hasMoreSearch: boolean
  isSearchLoading: boolean
  currentSearch: SearchOrdersDTO | undefined
}

const headers: Array<Header> = [
  {
    name: 'Référence',
    value: 'reference'
  },
  {
    name: 'Client',
    value: 'client'
  },
  {
    name: 'Email',
    value: 'email'
  },
  {
    name: 'Date',
    value: 'createdDate'
  },
  {
    name: 'Statut',
    value: 'status'
  },
  {
    name: 'Statut Livraison',
    value: 'deliveryStatus'
  },
  {
    name: 'Total TTC',
    value: 'total'
  },
  {
    name: 'Statut Paiement',
    value: 'paymentStatus'
  }
]

const getOrderEmail = (order: Order): string => {
  if (isAnonymousOrder(order)) return order.contact.email
  return order.deliveries[0]?.receiver?.contact?.email ?? ''
}

const getOrderItemVM = (order: Order): GetOrdersItemVM => {
  const formatter = priceFormatter('fr-FR', 'EUR')
  const total = computeTotalWithTaxForOrder(order)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return {
    reference: order.uuid,
    href: `/orders/${order.uuid}`,
    client: `${order.deliveryAddress.firstname[0]}. ${order.deliveryAddress.lastname}`,
    email: getOrderEmail(order),
    createdDate: timestampToLocaleString(order.createdAt, 'fr-FR', options),
    createdDatetime: new Date(order.createdAt),
    status: getOrderStatus(order),
    total: formatter.format(total / 100),
    paymentStatus: order.payment?.status || PaymentStatus.WaitingForPayment,
    deliveryStatus: getDeliveryStatus(order)
  }
}

const isAnyFilterActive = (
  filter: SearchOrdersDTO | undefined
): boolean => {
  if (!filter) return false
  return Boolean(
    filter.query ||
      filter.startDate ||
      filter.endDate ||
      filter.orderStatus !== undefined ||
      filter.deliveryStatus !== undefined ||
      filter.paymentStatus !== undefined ||
      filter.customerUuid
  )
}

export const getOrdersVM = (key: string): GetOrdersVM => {
  const searchStore = useSearchStore()
  const orderStore = useOrderStore()
  const searchFilter = searchStore.getFilter(key)
  const orders = isAnyFilterActive(searchFilter)
    ? (searchStore.get(key) ?? [])
    : orderStore.items
  return {
    headers,
    items: orders.map((o) => getOrderItemVM(o)),
    isLoading: orderStore.isLoading || searchStore.isLoading(key),
    hasMore: orderStore.hasMore,
    hasMoreSearch: searchStore.hasMoreSearch(key),
    isSearchLoading: searchStore.isLoading(key),
    currentSearch: searchFilter
  }
}
