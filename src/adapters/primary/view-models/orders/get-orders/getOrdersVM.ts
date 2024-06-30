import {
  computeTotalWithTaxForOrder,
  Header
} from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { useOrderStore } from '@store/orderStore'
import {
  DeliveryStatus,
  getDeliveryStatus,
  Order,
  PaymentStatus
} from '@core/entities/order'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'

export interface GetOrdersItemVM {
  reference: string
  href: string
  client: string
  createdDate: string
  createdDatetime: Date
  deliveryStatus: DeliveryStatus
  total: string
  paymentStatus: PaymentStatus
}

export interface GetOrdersVM {
  headers: Array<Header>
  items: Array<GetOrdersItemVM>
  isLoading: boolean
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
    deliveryStatus: getDeliveryStatus(order),
    total: formatter.format(total / 100),
    paymentStatus: order.payment.status
  }
}

export const getOrdersVM = (): GetOrdersVM => {
  const orderStore = useOrderStore()
  const orders = orderStore.items
  return {
    headers,
    items: orders.map((o) => getOrderItemVM(o)),
    isLoading: false
  }
}
