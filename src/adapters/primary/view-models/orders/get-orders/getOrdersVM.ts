import { ActiveFilterVM } from '@adapters/primary/view-models/shared/filters'
import { DeliveryStatus } from '@core/entities/delivery'
import {
  getDeliveryStatus,
  getOrderStatus,
  isAnonymousOrder,
  Order,
  OrderLineStatus,
  PaymentStatus
} from '@core/entities/order'
import {
  SearchOrdersDTO,
  TotalTtcOperator
} from '@core/usecases/order/orders-searching/searchOrders'
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
  activeFilters: Array<ActiveFilterVM>
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

const isAnyFilterActive = (filter: SearchOrdersDTO | undefined): boolean => {
  if (!filter) return false
  return Boolean(
    filter.query ||
      filter.startDate ||
      filter.endDate ||
      filter.orderStatus !== undefined ||
      filter.deliveryStatus !== undefined ||
      filter.paymentStatus !== undefined ||
      filter.customerUuid ||
      filter.totalTtcConditions?.length
  )
}

const orderStatusChipLabels: Record<OrderLineStatus, string> = {
  [OrderLineStatus.Created]: 'Crée',
  [OrderLineStatus.Started]: 'En préparation',
  [OrderLineStatus.Prepared]: 'Préparé',
  [OrderLineStatus.Canceled]: 'Annulé'
}

const deliveryStatusChipLabels: Record<DeliveryStatus, string> = {
  [DeliveryStatus.Created]: 'Crée',
  [DeliveryStatus.Prepared]: 'Préparé',
  [DeliveryStatus.Shipped]: 'Expédié',
  [DeliveryStatus.Delivered]: 'Livré'
}

const paymentStatusChipLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.WaitingForPayment]: 'En attente de paiement',
  [PaymentStatus.Payed]: 'Payé',
  [PaymentStatus.Rejected]: 'Payment rejeté'
}

const totalTtcOperatorSymbols: Record<TotalTtcOperator, string> = {
  lte: '≤',
  eq: '=',
  gte: '≥'
}

const buildActiveFilters = (
  filter: SearchOrdersDTO | undefined
): Array<ActiveFilterVM> => {
  if (!filter) return []
  const formatter = priceFormatter('fr-FR', 'EUR')
  const activeFilters: Array<ActiveFilterVM> = []
  if (filter.query) {
    activeFilters.push({ key: 'query', label: `Recherche : "${filter.query}"` })
  }
  if (filter.startDate) {
    activeFilters.push({
      key: 'startDate',
      label: `Depuis le ${timestampToLocaleString(filter.startDate, 'fr-FR')}`
    })
  }
  if (filter.endDate) {
    activeFilters.push({
      key: 'endDate',
      label: `Jusqu'au ${timestampToLocaleString(filter.endDate, 'fr-FR')}`
    })
  }
  if (filter.orderStatus !== undefined) {
    activeFilters.push({
      key: 'orderStatus',
      label: `Statut : ${orderStatusChipLabels[filter.orderStatus]}`
    })
  }
  if (filter.deliveryStatus !== undefined) {
    activeFilters.push({
      key: 'deliveryStatus',
      label: `Livraison : ${deliveryStatusChipLabels[filter.deliveryStatus]}`
    })
  }
  if (filter.paymentStatus !== undefined) {
    activeFilters.push({
      key: 'paymentStatus',
      label: `Paiement : ${paymentStatusChipLabels[filter.paymentStatus]}`
    })
  }
  filter.totalTtcConditions?.forEach((condition, index) => {
    activeFilters.push({
      key: 'totalTtc',
      index,
      label: `Total TTC ${totalTtcOperatorSymbols[condition.operator]} ${formatter.format(condition.value / 100)}`
    })
  })
  return activeFilters
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
    currentSearch: searchFilter,
    activeFilters: buildActiveFilters(searchFilter)
  }
}
