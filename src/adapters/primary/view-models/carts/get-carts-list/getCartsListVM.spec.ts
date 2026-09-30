import { CartListTab } from '@core/entities/cart'
import { useCartListStore } from '@store/cartListStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import {
  elodieClosedCartItem,
  elodieOpenCartItem,
  guestOpenCartItem
} from '@utils/testData/carts'
import { createPinia, setActivePinia } from 'pinia'
import { type CartListItemVM, getCartsListVM } from './getCartsListVM'

const euros = (cents: number) =>
  priceFormatter('fr-FR', 'EUR').format(cents / 100)
const dateTime = (timestamp: number) =>
  timestampToLocaleString(timestamp, 'fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

describe('Get carts list VM', () => {
  let cartListStore: ReturnType<typeof useCartListStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    cartListStore = useCartListStore()
  })

  it('should offer one tab per cart status after all carts', () => {
    expect(getCartsListVM().tabs.map((tab) => tab.labelKey)).toStrictEqual([
      'carts.tabs.ALL',
      'carts.tabs.OPEN',
      'carts.tabs.ABANDONED',
      'carts.tabs.CLOSED'
    ])
  })

  it('should show a customer cart with its refused code, linking to the customer', () => {
    cartListStore.list(CartListTab.All, [elodieOpenCartItem])
    expect(getCartsListVM().tabs[0].items).toStrictEqual<Array<CartListItemVM>>(
      [
        {
          uuid: elodieOpenCartItem.uuid,
          customer: 'Élodie Durand',
          total: euros(elodieOpenCartItem.totalWithTax!),
          quantity: elodieOpenCartItem.totalQuantity,
          lastActivity: dateTime(elodieOpenCartItem.lastActivityAt),
          statusKey: 'carts.status.OPEN',
          rejectedCode: 'BIENVENUE',
          link: `/customers/get/${elodieOpenCartItem.customer!.uuid}`
        }
      ]
    )
  })

  it('should show a guest cart without total nor link', () => {
    cartListStore.list(CartListTab.All, [guestOpenCartItem])
    expect(getCartsListVM().tabs[0].items).toStrictEqual<Array<CartListItemVM>>(
      [
        {
          uuid: guestOpenCartItem.uuid,
          customer: '',
          isGuest: true,
          total: '',
          quantity: guestOpenCartItem.totalQuantity,
          lastActivity: dateTime(guestOpenCartItem.lastActivityAt),
          statusKey: 'carts.status.OPEN',
          rejectedCode: ''
        }
      ]
    )
  })

  it('should link a closed cart to its order', () => {
    cartListStore.list(CartListTab.Closed, [elodieClosedCartItem])
    expect(getCartsListVM().tabs[3].items[0].link).toStrictEqual(
      `/orders/${elodieClosedCartItem.orderUuid}`
    )
  })
})
