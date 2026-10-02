import {
  type CartListItem,
  type CartListPagination,
  type CartListTab,
  statusOfTab
} from '@core/entities/cart'
import type { CartGateway } from '@core/gateways/cartGateway'
import { useCartListStore } from '@store/cartListStore'

export const listCarts = async (
  tab: CartListTab,
  pagination: CartListPagination,
  cartGateway: CartGateway
): Promise<void> => {
  const cartListStore = useCartListStore()
  const filters = cartListStore.filters
  cartListStore.startLoading(tab)
  try {
    const items = await cartGateway.list(statusOfTab(tab), filters, pagination)
    if (cartListStore.filters === filters) {
      showPage(tab, pagination, items)
    }
  } finally {
    cartListStore.stopLoading(tab)
  }
}

const showPage = (
  tab: CartListTab,
  pagination: CartListPagination,
  items: Array<CartListItem>
): void => {
  const cartListStore = useCartListStore()
  if (pagination.offset === 0) {
    cartListStore.list(tab, items)
  } else {
    cartListStore.append(tab, items)
  }
  cartListStore.setHasMore(tab, items.length === pagination.limit)
}
