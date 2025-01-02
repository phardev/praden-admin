import {
  computeTotalWithTaxForOrder,
  Header
} from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { useOrderStore } from '@store/orderStore'
import {
  OrderLineStatus,
  getDeliveryStatus,
  Order,
  PaymentStatus,
  getOrderStatus
} from '@core/entities/order'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { useSearchStore } from '@store/searchStore'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { DeliveryStatus } from '@core/entities/delivery'

export interface GetOrdersItemVM {
  reference: string
  href: string
  client: string
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

const getOrderItemVM = (order: Order): GetOrdersItemVM => {
  const formatter = priceFormatter('fr-FR', 'EUR')
  const total = computeTotalWithTaxForOrder(order)
  return {
    reference: order.uuid,
    href: `/orders/${order.uuid}`,
    client: `${order.deliveryAddress.firstname[0]}. ${order.deliveryAddress.lastname}`,
    createdDate: timestampToLocaleString(order.createdAt, 'fr-FR'),
    createdDatetime: new Date(order.createdAt),
    status: getOrderStatus(order),
    total: formatter.format(total / 100),
    paymentStatus: order.payment?.status || PaymentStatus.WaitingForPayment,
    deliveryStatus: getDeliveryStatus(order)
  }
}

export const getOrdersVM = (key: string): GetOrdersVM => {
  const searchStore = useSearchStore()
  const orderStore = useOrderStore()
  const orders = searchStore.get(key) || orderStore.items
  const searchFilter = searchStore.getFilter(key)
  return {
    headers,
    items: orders.map((o) => getOrderItemVM(o)),
    isLoading: false,
    currentSearch: searchFilter
  }
}
