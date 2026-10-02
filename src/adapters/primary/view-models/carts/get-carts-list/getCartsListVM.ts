import type { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  type CartListItem,
  CartListStatus,
  CartListTab
} from '@core/entities/cart'
import { useCartListStore } from '@store/cartListStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'

export interface CartListItemVM {
  uuid: string
  customer: string
  isGuest?: boolean
  total: string
  quantity: number
  lastActivity: string
  statusKey: string
  rejectedCode: string
  link: string
}

export interface CartListTabVM {
  tab: CartListTab
  labelKey: string
  headers: Array<Header>
  items: Array<CartListItemVM>
  hasMore: boolean
  isLoading: boolean
}

export interface GetCartsListVM {
  tabs: Array<CartListTabVM>
}

const TABS: Array<CartListTab> = [
  CartListTab.All,
  CartListTab.Open,
  CartListTab.Abandoned,
  CartListTab.Closed
]

const headers: Array<Header> = [
  { name: 'carts.headers.customer', value: 'customer' },
  { name: 'carts.headers.total', value: 'total' },
  { name: 'carts.headers.quantity', value: 'quantity' },
  { name: 'carts.headers.lastActivity', value: 'lastActivity' },
  { name: 'carts.headers.status', value: 'status' },
  { name: 'carts.headers.rejectedCode', value: 'rejectedCode' }
]

const euros = (cents: number): string =>
  priceFormatter('fr-FR', 'EUR').format(cents / 100)

const dateTime = (timestamp: number): string =>
  timestampToLocaleString(timestamp, 'fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

const linkOf = (item: CartListItem): string =>
  item.status === CartListStatus.Closed && item.orderUuid
    ? `/orders/${item.orderUuid}`
    : `/customers/carts/${item.uuid}`

const customerNameOf = (item: CartListItem): string =>
  item.customer
    ? [item.customer.firstname, item.customer.lastname]
        .filter(Boolean)
        .join(' ') || item.customer.email
    : (item.contactEmail ?? '')

const itemVM = (item: CartListItem): CartListItemVM => ({
  uuid: item.uuid,
  customer: customerNameOf(item),
  ...(!item.customer && { isGuest: true }),
  total: item.totalWithTax !== undefined ? euros(item.totalWithTax) : '',
  quantity: item.totalQuantity,
  lastActivity: dateTime(item.lastActivityAt),
  statusKey: `carts.status.${item.status}`,
  rejectedCode: item.lastRejectedCode ?? '',
  link: linkOf(item)
})

export const getCartsListVM = (): GetCartsListVM => {
  const cartListStore = useCartListStore()
  return {
    tabs: TABS.map((tab) => ({
      tab,
      labelKey: `carts.tabs.${tab}`,
      headers,
      items: cartListStore.items[tab].map(itemVM),
      hasMore: cartListStore.hasMore[tab],
      isLoading: cartListStore.isLoading[tab]
    }))
  }
}
