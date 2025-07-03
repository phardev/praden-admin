import {
  GetPreparationsVM,
  Header
} from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import {
  orderInPreparation1,
  orderPrepared1,
  orderSaved1,
  orderWaitingForClientAnswer1,
  orderWaitingForClientAnswer2,
  orderWaitingForRestock
} from '@utils/testData/orders'
import { Stock } from '@core/entities/product'
import { chamomilla, dolodent } from '@utils/testData/products'
import { useProductStore } from '@store/productStore'
import { getWaitingPreparationsVM } from '@adapters/primary/view-models/preparations/get-waiting-preparations/getWaitingPreparationsVM'

describe('Get orders to prepare VM', () => {
  let preparationStore: any
  let productStore: any
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
      name: 'Transporteur',
      value: 'carrier'
    },
    {
      name: 'Date',
      value: 'createdDate'
    },
    {
      name: 'Total TTC',
      value: 'total'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    productStore = useProductStore()
  })
  describe('There is no orders waiting to be prepared', () => {
    it('should list nothing', () => {
      expectVMToMatch({})
    })
  })
  describe('There is no orders not waiting to be prepared', () => {
    it('should list nothing', () => {
      preparationStore.items = [orderPrepared1, orderSaved1]
      expectVMToMatch({})
    })
  })
  describe('There is some orders waiting client answer', () => {
    it('should list all of them', () => {
      preparationStore.items = [
        orderWaitingForClientAnswer1,
        orderWaitingForClientAnswer2
      ]
      const expectedVM: GetPreparationsVM = {
        items: {
          'En attente de réponse client': {
            count: 2,
            canSelect: false,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: orderWaitingForClientAnswer2.uuid,
                  href: `/preparations/${orderWaitingForClientAnswer2.uuid}`,
                  client: "J. D'arc",
                  createdDate: '21 janv. 2023, 03:59',
                  createdDatetime: new Date('2023-01-21T03:59:59.954Z'),
                  total: '19,75\u00A0€'
                },
                {
                  reference: orderWaitingForClientAnswer1.uuid,
                  href: `/preparations/${orderWaitingForClientAnswer1.uuid}`,
                  client: 'J. Bon',
                  createdDate: '21 janv. 2023, 04:03',
                  createdDatetime: new Date('2023-01-21T04:03:09.000Z'),
                  total: '11,00\u00A0€'
                }
              ]
            }
          }
        },
        isLoading: false
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some preparations waiting for replenishment', () => {
    it('should list all of them if stock is not available', () => {
      const stock: Stock = {
        [dolodent.ean13]: 1
      }
      givenStockIs(stock)
      preparationStore.items = [orderInPreparation1]
      const expectedVM: Partial<GetPreparationsVM> = {
        items: {
          'En attente de réapprovisionnement': {
            count: 1,
            canSelect: false,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: orderInPreparation1.uuid,
                  href: `/preparations/${orderInPreparation1.uuid}`,
                  client: 'J. Bon',
                  createdDate: '5 févr. 2023, 02:33',
                  createdDatetime: new Date('2023-02-05T02:33:40.539Z'),
                  total: '11,00\u00A0€'
                }
              ]
            }
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
    it('should not list if stock is available', () => {
      const stock: Stock = {
        [dolodent.ean13]: 100
      }
      givenStockIs(stock)
      preparationStore.items = [orderInPreparation1]
      expectVMToMatch({})
    })
    it('should not list if stock is enough to complete', () => {
      const order = JSON.parse(JSON.stringify(orderWaitingForRestock))
      order.lines[0].preparedQuantity = 1
      order.lines[0].expectedQuantity = 2
      const stock: Stock = {
        [chamomilla.ean13]: 1
      }
      givenStockIs(stock)
      preparationStore.items = [order]
      expectVMToMatch({})
    })
  })

  const givenStockIs = (stock: Stock) => {
    productStore.stock = stock
  }

  const expectVMToMatch = (expectedVM: Partial<GetPreparationsVM>) => {
    const emptyVM: GetPreparationsVM = {
      items: {
        'En attente de réponse client': {
          count: 0,
          canSelect: false,
          table: {
            headers: expectedHeaders,
            items: []
          }
        },
        'En attente de réapprovisionnement': {
          count: 0,
          canSelect: false,
          table: {
            headers: expectedHeaders,
            items: []
          }
        }
      },
      isLoading: false
    }
    expect(getWaitingPreparationsVM()).toMatchObject({
      ...emptyVM,
      ...expectedVM
    })
  }
})
