import { DeliveryStatus, Order, PaymentStatus } from '@core/entities/order'
import { useOrderStore } from '@store/orderStore'
import { createPinia, setActivePinia } from 'pinia'
import { getOrdersVM, GetOrdersVM } from './getOrdersVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  orderNotPayed1,
  orderPrepared1,
  orderToPrepare1
} from '@utils/testData/orders'
import { useSearchStore } from '@store/searchStore'

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
              createdDate: '21 janv. 2023',
              createdDatetime: new Date('2023-01-21T03:54:39.000Z'),
              deliveryStatus: DeliveryStatus.Created,
              total: '11,00\u00A0€',
              paymentStatus: orderPrepared1.payment.status
            },
            {
              reference: orderPrepared1.uuid,
              href: `/orders/${orderPrepared1.uuid}`,
              client: 'J. Bon',
              createdDate: '5 févr. 2023',
              createdDatetime: new Date('2023-02-05T02:33:40.539Z'),
              deliveryStatus: DeliveryStatus.Shipped,
              total: '11,00\u00A0€',
              paymentStatus: orderPrepared1.payment.status
            },
            {
              reference: orderNotPayed1.uuid,
              href: `/orders/${orderNotPayed1.uuid}`,
              client: 'J. Bon',
              createdDate: '21 janv. 2023',
              createdDatetime: new Date('2023-01-21T04:03:09.000Z'),
              deliveryStatus: DeliveryStatus.Created,
              total: '11,00\u00A0€',
              paymentStatus: orderNotPayed1.payment.status
            }
          ]
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('There is some filters', () => {
      it('should get all search result orders vm', () => {
        searchStore.set(key, [orderToPrepare1, orderNotPayed1])
        const expectedVM: Partial<GetOrdersVM> = {
          items: [
            {
              reference: orderToPrepare1.uuid,
              href: `/orders/${orderToPrepare1.uuid}`,
              client: 'J. Bon',
              createdDate: '21 janv. 2023',
              createdDatetime: new Date('2023-01-21T03:54:39.000Z'),
              deliveryStatus: DeliveryStatus.Created,
              total: '11,00\u00A0€',
              paymentStatus: orderPrepared1.payment.status
            },
            {
              reference: orderNotPayed1.uuid,
              href: `/orders/${orderNotPayed1.uuid}`,
              client: 'J. Bon',
              createdDate: '21 janv. 2023',
              createdDatetime: new Date('2023-01-21T04:03:09.000Z'),
              deliveryStatus: DeliveryStatus.Created,
              total: '11,00\u00A0€',
              paymentStatus: orderNotPayed1.payment.status
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
          deliveryStatus: DeliveryStatus.Processing,
          paymentStatus: PaymentStatus.Payed
        })
        const expectedVM: Partial<GetOrdersVM> = {
          currentSearch: {
            query: 'test',
            startDate: 1234567890,
            endDate: 9234567890,
            deliveryStatus: DeliveryStatus.Processing,
            paymentStatus: PaymentStatus.Payed
          }
        }
        expectVMToMatch(expectedVM)
      })
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
      currentSearch: undefined
    }
    expect(getOrdersVM(key)).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})
