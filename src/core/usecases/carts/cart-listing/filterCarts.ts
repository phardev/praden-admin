import type { CartListFilters } from '@core/entities/cart'
import { useCartListStore } from '@store/cartListStore'

export const filterCarts = (filters: CartListFilters): void => {
  useCartListStore().setFilters(filters)
}
