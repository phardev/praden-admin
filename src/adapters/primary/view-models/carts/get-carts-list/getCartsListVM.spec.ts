import { CartListTab } from '@core/entities/cart'
import { useCartListStore } from '@store/cartListStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import {
  elodieClosedCartItem,
  elodieOpenCartItem,
  guestOpenCartItem,
  lucasAbandonedCartItem
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

  it('should show a customer cart with its refused code, linking to the cart', () => {
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
          link: `/customers/carts/${elodieOpenCartItem.uuid}`
        }
      ]
    )
  })

  it('should show an anonymous guest cart without total, linking to the cart', () => {
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
          rejectedCode: '',
          link: `/customers/carts/${guestOpenCartItem.uuid}`
        }
      ]
    )
  })

  it('should show the email a visitor left on their cart', () => {
    const contactEmail = 'visiteur@example.com'
    cartListStore.list(CartListTab.All, [
      { ...guestOpenCartItem, contactEmail }
    ])
    expect(getCartsListVM().tabs[0].items).toStrictEqual<Array<CartListItemVM>>(
      [
        {
          uuid: guestOpenCartItem.uuid,
          customer: contactEmail,
          isGuest: true,
          total: '',
          quantity: guestOpenCartItem.totalQuantity,
          lastActivity: dateTime(guestOpenCartItem.lastActivityAt),
          statusKey: 'carts.status.OPEN',
          rejectedCode: '',
          link: `/customers/carts/${guestOpenCartItem.uuid}`
        }
      ]
    )
  })

  it('should show the email of a customer who gave no name', () => {
    const namelessCustomerCart = {
      ...elodieOpenCartItem,
      customer: {
        uuid: elodieOpenCartItem.customer!.uuid,
        email: elodieOpenCartItem.customer!.email
      }
    }
    cartListStore.list(CartListTab.All, [namelessCustomerCart])
    expect(getCartsListVM().tabs[0].items).toStrictEqual<Array<CartListItemVM>>(
      [
        {
          uuid: elodieOpenCartItem.uuid,
          customer: elodieOpenCartItem.customer!.email,
          total: euros(elodieOpenCartItem.totalWithTax!),
          quantity: elodieOpenCartItem.totalQuantity,
          lastActivity: dateTime(elodieOpenCartItem.lastActivityAt),
          statusKey: 'carts.status.OPEN',
          rejectedCode: elodieOpenCartItem.lastRejectedCode!,
          link: `/customers/carts/${elodieOpenCartItem.uuid}`
        }
      ]
    )
  })

  it('should label an abandoned cart as abandoned', () => {
    cartListStore.list(CartListTab.Abandoned, [lucasAbandonedCartItem])
    expect(getCartsListVM().tabs[2].items).toStrictEqual<Array<CartListItemVM>>(
      [
        {
          uuid: lucasAbandonedCartItem.uuid,
          customer: `${lucasAbandonedCartItem.customer!.firstname} ${lucasAbandonedCartItem.customer!.lastname}`,
          total: euros(lucasAbandonedCartItem.totalWithTax!),
          quantity: lucasAbandonedCartItem.totalQuantity,
          lastActivity: dateTime(lucasAbandonedCartItem.lastActivityAt),
          statusKey: 'carts.status.ABANDONED',
          rejectedCode: '',
          link: `/customers/carts/${lucasAbandonedCartItem.uuid}`
        }
      ]
    )
  })

  it('should expose no active filter when none is applied', () => {
    expect(getCartsListVM().activeFilters).toStrictEqual([])
  })

  describe('Given filters are applied', () => {
    const filters = {
      customerQuery: 'durand',
      startDate: lucasAbandonedCartItem.lastActivityAt,
      endDate: elodieOpenCartItem.lastActivityAt
    }

    beforeEach(() => {
      cartListStore.setFilters(filters)
    })

    it('should expose the applied filters', () => {
      expect(getCartsListVM().currentFilters).toStrictEqual(filters)
    })

    it('should expose one removable chip per filter', () => {
      expect(getCartsListVM().activeFilters).toStrictEqual([
        { key: 'customerQuery', label: 'Client : "durand"' },
        {
          key: 'startDate',
          label: `Depuis le ${timestampToLocaleString(filters.startDate, 'fr-FR')}`
        },
        {
          key: 'endDate',
          label: `Jusqu'au ${timestampToLocaleString(filters.endDate, 'fr-FR')}`
        }
      ])
    })
  })

  it('should link a closed cart to its order', () => {
    cartListStore.list(CartListTab.Closed, [elodieClosedCartItem])
    expect(getCartsListVM().tabs[3].items[0].link).toStrictEqual(
      `/orders/${elodieClosedCartItem.orderUuid}`
    )
  })
})
