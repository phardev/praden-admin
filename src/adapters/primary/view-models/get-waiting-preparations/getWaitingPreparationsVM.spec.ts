import {
  GetPreparationsVM,
  Header
} from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'
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
import { uriage, atoderm } from '@utils/testData/products'
import { useProductStore } from '@store/productStore'
import { getWaitingPreparationsVM } from '@adapters/primary/view-models/get-waiting-preparations/getWaitingPreparationsVM'

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
        'En attente de réponse client': {
          count: 2,
          table: {
            headers: expectedHeaders,
            items: [
              {
                reference: orderWaitingForClientAnswer1.uuid,
                href: `/preparations/${orderWaitingForClientAnswer1.uuid}`,
                client: 'J. Bon',
                createdDate: '21 janv. 2023',
                createdDatetime: new Date('2023-01-21T04:03:09.000Z'),
                total: '11,00\u00A0€'
              },
              {
                reference: orderWaitingForClientAnswer2.uuid,
                href: `/preparations/${orderWaitingForClientAnswer2.uuid}`,
                client: "J. D'arc",
                createdDate: '21 janv. 2023',
                createdDatetime: new Date('2023-01-21T03:59:59.954Z'),
                total: '19,76\u00A0€'
              }
            ]
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some preparations waiting for replenishment', () => {
    it('should list all of them if stock is not available', () => {
      const stock: Stock = {
        [atoderm.cip13]: 1
      }
      givenStockIs(stock)
      preparationStore.items = [orderInPreparation1]
      const expectedVM: GetPreparationsVM = {
        'En attente de réapprovisionnement': {
          count: 1,
          table: {
            headers: expectedHeaders,
            items: [
              {
                reference: orderInPreparation1.uuid,
                href: `/preparations/${orderInPreparation1.uuid}`,
                client: 'J. Bon',
                createdDate: '5 févr. 2023',
                createdDatetime: new Date('2023-02-05T02:33:40.539Z'),
                total: '11,00\u00A0€'
              }
            ]
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
    it('should not list if stock is available', () => {
      const stock: Stock = {
        [atoderm.cip13]: 100
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
        [uriage.cip13]: 1
      }
      givenStockIs(stock)
      preparationStore.items = [order]
      expectVMToMatch({})
    })
  })

  const givenStockIs = (stock: Stock) => {
    productStore.stock = stock
  }

  const expectVMToMatch = (expectedVM: GetPreparationsVM) => {
    const emptyVM: GetPreparationsVM = {
      'En attente de réponse client': {
        count: 0,
        table: {
          headers: expectedHeaders,
          items: []
        }
      },
      'En attente de réapprovisionnement': {
        count: 0,
        table: {
          headers: expectedHeaders,
          items: []
        }
      }
    }
    expect(getWaitingPreparationsVM()).toMatchObject({
      ...emptyVM,
      ...expectedVM
    })
  }
})
