import {
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
  cartListStore.startLoading()
  try {
    const items = await cartGateway.list(statusOfTab(tab), pagination)
    if (pagination.offset === 0) {
      cartListStore.list(tab, items)
    } else {
      cartListStore.append(tab, items)
    }
    cartListStore.setHasMore(tab, items.length === pagination.limit)
  } finally {
    cartListStore.stopLoading()
  }
}
