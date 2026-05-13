import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { DeliveryStatus } from '@core/entities/delivery'
import { Order, OrderLineStatus, PaymentStatus } from '@core/entities/order'
import { useOrderStore } from '@store/orderStore'
import { useSearchStore } from '@store/searchStore'
import {
  orderNotPayed1,
  orderPrepared1,
  orderToPrepare1,
  orderWithoutDelivery,
  orderWithPromotionCode
} from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'
import { GetOrdersVM, getOrdersVM } from './getOrdersVM'

const expectedHeaders: Array<Header> = [
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

describe('Get orders VM', () => {
  let orderStore: any
  let searchStore: any
  const key = 'index-orders'

  beforeEach(() => {
    setActivePinia(createPinia())
    orderStore = useOrderStore()
    searchStore = useSearchStore()
  })
  describe('There is no orders', () => {
    it('should get empty vm', () => {
      const expectedVM: Partial<GetOrdersVM> = {
        items: []
      }
      expectVMToMatch(expectedVM)
    })
  })

  describe('There some orders', () => {
    describe('There is no filter', () => {
      it('should get all orders vm', () => {
        givenExistingOrders(orderToPrepare1, orderPrepared1, orderNotPayed1)
        const expectedVM: Partial<GetOrdersVM> = {
          items: [
            {
              reference: orderToPrepare1.uuid,
              href: `/orders/${orderToPrepare1.uuid}`,
              client: 'J. Bon',
              email: orderToPrepare1.contact.email,
              createdDate: '21 janv. 2023, 03:54',
              createdDatetime: new Date('2023-01-21T03:54:39.000Z'),
              status: OrderLineStatus.Created,
              total: '11,00 €',
              paymentStatus: orderToPrepare1.payment!.status,
              deliveryStatus: orderToPrepare1.deliveries[0].status
            },
            {
              reference: orderPrepared1.uuid,
              href: `/orders/${orderPrepared1.uuid}`,
              client: 'J. Bon',
              email: orderPrepared1.contact.email,
              createdDate: '5 févr. 2023, 02:33',
              createdDatetime: new Date('2023-02-05T02:33:40.539Z'),
              status: OrderLineStatus.Prepared,
              total: '11,00 €',
              paymentStatus: orderPrepared1.payment!.status,
              deliveryStatus: orderPrepared1.deliveries[0].status
            },
            {
              reference: orderNotPayed1.uuid,
              href: `/orders/${orderNotPayed1.uuid}`,
              client: 'J. Bon',
              email: orderNotPayed1.contact.email,
              createdDate: '21 janv. 2023, 04:03',
              createdDatetime: new Date('2023-01-21T04:03:09.000Z'),
              status: OrderLineStatus.Created,
              total: '11,00 €',
              paymentStatus: orderNotPayed1.payment!.status,
              deliveryStatus: orderNotPayed1.deliveries[0].status
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })

      it('should apply promotion code discount to total', () => {
        givenExistingOrders(orderWithPromotionCode)
        const expectedVM: Partial<GetOrdersVM> = {
          items: [
            {
              reference: orderWithPromotionCode.uuid,
              href: `/orders/${orderWithPromotionCode.uuid}`,
              client: 'J. Bon',
              email: orderWithPromotionCode.contact.email,
              createdDate: '21 janv. 2023, 03:54',
              createdDatetime: new Date('2023-01-21T03:54:39.000Z'),
              status: OrderLineStatus.Created,
              total: '6,00 €',
              paymentStatus: orderWithPromotionCode.payment!.status,
              deliveryStatus: orderWithPromotionCode.deliveries[0].status
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('There is some filters', () => {
      it('should get all search result orders vm', () => {
        searchStore.setFilter(key, { query: 'jean' })
        searchStore.set(key, [orderToPrepare1, orderNotPayed1])
        const expectedVM: Partial<GetOrdersVM> = {
          currentSearch: { query: 'jean' },
          items: [
            {
              reference: orderToPrepare1.uuid,
              href: `/orders/${orderToPrepare1.uuid}`,
              client: 'J. Bon',
              email: orderToPrepare1.contact.email,
              createdDate: '21 janv. 2023, 03:54',
              createdDatetime: new Date('2023-01-21T03:54:39.000Z'),
              status: OrderLineStatus.Created,
              total: '11,00 €',
              paymentStatus: orderToPrepare1.payment!.status,
              deliveryStatus: orderToPrepare1.deliveries[0].status
            },
            {
              reference: orderNotPayed1.uuid,
              href: `/orders/${orderNotPayed1.uuid}`,
              client: 'J. Bon',
              email: orderNotPayed1.contact.email,
              createdDate: '21 janv. 2023, 04:03',
              createdDatetime: new Date('2023-01-21T04:03:09.000Z'),
              status: OrderLineStatus.Created,
              total: '11,00 €',
              paymentStatus: orderNotPayed1.payment!.status,
              deliveryStatus: orderNotPayed1.deliveries[0].status
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
      it('should get all search filters', () => {
        searchStore.setFilter(key, {
          query: 'test',
          startDate: 1234567890,
          endDate: 9234567890,
          orderStatus: OrderLineStatus.Started,
          paymentStatus: PaymentStatus.Payed
        })
        const expectedVM: Partial<GetOrdersVM> = {
          currentSearch: {
            query: 'test',
            startDate: 1234567890,
            endDate: 9234567890,
            orderStatus: OrderLineStatus.Started,
            paymentStatus: PaymentStatus.Payed
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
  })

  describe('An order does not have delivery', () => {
    it('should get it with default delivery', () => {
      givenExistingOrders(orderWithoutDelivery)
      const expectedVM: Partial<GetOrdersVM> = {
        items: [
          {
            reference: orderWithoutDelivery.uuid,
            href: `/orders/${orderWithoutDelivery.uuid}`,
            client: 'J. Bon',
            email: orderWithoutDelivery.contact.email,
            createdDate: '21 janv. 2023, 03:54',
            createdDatetime: new Date('2023-01-21T03:54:39.000Z'),
            status: OrderLineStatus.Created,
            total: '11,00 €',
            paymentStatus: orderWithoutDelivery.payment!.status,
            deliveryStatus: DeliveryStatus.Created
          }
        ]
      }
      expectVMToMatch(expectedVM)
    })
  })

  describe('Loading display during search', () => {
    it('returns empty items while a search filter is active and the store has no results yet', () => {
      givenExistingOrders(orderToPrepare1, orderPrepared1, orderNotPayed1)
      searchStore.setFilter(key, { query: 'jean' })
      expect(getOrdersVM(key).items).toStrictEqual([])
    })
    it('keeps falling back to orderStore.items when a search ran with no filter values', () => {
      givenExistingOrders(orderToPrepare1)
      searchStore.setFilter(key, {})
      expect(getOrdersVM(key).items).toHaveLength(1)
    })
  })

  describe('Pagination flags', () => {
    it('should expose hasMore from the order store', () => {
      orderStore.hasMore = true
      expect(getOrdersVM(key).hasMore).toBe(true)
    })
    it('should expose hasMoreSearch from the search store', () => {
      searchStore.setPagination(key, { total: 1, from: 0, hasMore: true })
      expect(getOrdersVM(key).hasMoreSearch).toBe(true)
    })
    it('should expose isSearchLoading from the search store', () => {
      searchStore.startLoading(key)
      expect(getOrdersVM(key).isSearchLoading).toBe(true)
    })
  })

  const givenExistingOrders = (...orders: Array<Order>) => {
    orderStore.items = orders
  }

  const expectVMToMatch = (expectedVM: any) => {
    const emptyVM: GetOrdersVM = {
      headers: expectedHeaders,
      items: [],
      isLoading: false,
      hasMore: false,
      hasMoreSearch: false,
      isSearchLoading: false,
      currentSearch: undefined
    }
    expect(getOrdersVM(key)).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})
