import {
  GetPreparationsVM,
  getPreparationsVM,
  Header
} from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import {
  orderInPreparation1,
  orderSaved1,
  orderToCancel,
  orderToPrepare1,
  orderToPrepare2,
  orderToPrepare3,
  orderWaitingForRestock,
  orderWithMissingProduct1,
  orderWithMissingProduct2
} from '@utils/testData/orders'
import { Stock } from '@core/entities/product'
import { chamomilla, dolodent } from '@utils/testData/products'
import { useProductStore } from '@store/productStore'

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
  describe('There is no orders to prepare', () => {
    it('should list nothing', () => {
      expectVMToMatch({})
    })
  })
  describe('There is some orders to prepare in click & collect', () => {
    it('should list all of them', () => {
      preparationStore.items = [orderToPrepare1, orderToPrepare2]
      const expectedVM: Partial<GetPreparationsVM> = {
        items: {
          'Click & Collect': {
            count: 2,
            canSelect: true,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: orderToPrepare1.uuid,
                  href: `/preparations/${orderToPrepare1.uuid}`,
                  client: 'J. Bon',
                  createdDate: '21 janv. 2023',
                  createdDatetime: new Date('2023-01-21T03:54:39.000Z'),
                  total: '11,00\u00A0€'
                },
                {
                  reference: orderToPrepare2.uuid,
                  href: `/preparations/${orderToPrepare2.uuid}`,
                  client: "J. D'arc",
                  createdDate: '5 févr. 2023',
                  createdDatetime: new Date('2023-02-05T02:59:32.527Z'),
                  total: '15,00\u00A0€'
                }
              ]
            }
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some orders to prepare in delivery', () => {
    it('should list all of them', () => {
      preparationStore.items = [orderToPrepare3]
      const expectedVM: Partial<GetPreparationsVM> = {
        items: {
          Colissimo: {
            count: 1,
            canSelect: true,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: orderToPrepare3.uuid,
                  href: `/preparations/${orderToPrepare3.uuid}`,
                  client: "J. D'arc",
                  createdDate: '5 févr. 2023',
                  createdDatetime: new Date('2023-02-05T02:59:32.527Z'),
                  total: '10,50\u00A0€'
                }
              ]
            }
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some preparations to finish', () => {
    it('should list all of them', () => {
      preparationStore.items = [orderSaved1]
      const expectedVM: Partial<GetPreparationsVM> = {
        items: {
          'À terminer': {
            count: 1,
            canSelect: true,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: orderSaved1.uuid,
                  href: `/preparations/${orderSaved1.uuid}`,
                  client: 'J. Bon',
                  createdDate: '21 janv. 2023',
                  createdDatetime: new Date('2023-01-21T04:03:09.000Z'),
                  total: '11,00\u00A0€'
                }
              ]
            }
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some preparations to complete', () => {
    it('should list all of them if stock is available', () => {
      const stock: Stock = {
        [dolodent.ean13]: 50
      }
      givenStockIs(stock)
      preparationStore.items = [orderInPreparation1]
      const expectedVM: Partial<GetPreparationsVM> = {
        items: {
          'À completer': {
            count: 1,
            canSelect: false,
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
      }
      expectVMToMatch(expectedVM)
    })
    it('should not list if stock is not available', () => {
      const stock: Stock = {
        [chamomilla.ean13]: 1
      }
      givenStockIs(stock)
      preparationStore.items = [orderWaitingForRestock]
      expectVMToMatch({})
    })
    it('should list if stock is enough to complete', () => {
      const order = JSON.parse(JSON.stringify(orderWaitingForRestock))
      order.lines[0].preparedQuantity = 1
      order.lines[0].expectedQuantity = 2
      const stock: Stock = {
        [chamomilla.ean13]: 1
      }
      givenStockIs(stock)
      preparationStore.items = [order]
      const expectedVM: Partial<GetPreparationsVM> = {
        items: {
          'À completer': {
            count: 1,
            canSelect: false,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: order.uuid,
                  href: `/preparations/${order.uuid}`,
                  client: 'J. Bon',
                  createdDate: '21 janv. 2023',
                  createdDatetime: new Date('2023-01-21T04:03:09.000Z'),
                  total: '13,79\u00A0€'
                }
              ]
            }
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some preparations to ship', () => {
    it('should list all of them', () => {
      preparationStore.items = [
        orderWithMissingProduct1,
        orderWithMissingProduct2
      ]
      const expectedVM: Partial<GetPreparationsVM> = {
        items: {
          'À expedier': {
            count: 2,
            canSelect: false,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: orderWithMissingProduct1.uuid,
                  href: `/preparations/${orderWithMissingProduct1.uuid}`,
                  client: 'J. Bon',
                  createdDate: '24 janv. 2023',
                  createdDatetime: new Date('2023-01-24T15:21:18.456Z'),
                  total: '36,00\u00A0€'
                },
                {
                  reference: orderWithMissingProduct2.uuid,
                  href: `/preparations/${orderWithMissingProduct2.uuid}`,
                  client: 'J. Bon',
                  createdDate: '24 janv. 2023',
                  createdDatetime: new Date('2023-01-24T15:21:18.456Z'),
                  total: '36,00\u00A0€'
                }
              ]
            }
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('There is some preparations to cancel', () => {
    it('should list all of them', () => {
      preparationStore.items = [orderToCancel]
      const expectedVM: Partial<GetPreparationsVM> = {
        items: {
          'À annuler': {
            count: 1,
            canSelect: false,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: orderToCancel.uuid,
                  href: `/preparations/${orderToCancel.uuid}`,
                  client: 'J. Bon',
                  createdDate: '24 janv. 2023',
                  createdDatetime: new Date('2023-01-24T15:21:18.456Z'),
                  total: '18,50\u00A0€'
                }
              ]
            }
          }
        }
      }
      expectVMToMatch(expectedVM)
    })
  })
  describe('Loading', () => {
    it('should be aware when loading', () => {
      preparationStore.isLoading = true
      const expectedVM: Partial<GetPreparationsVM> = {
        isLoading: true
      }
      expectVMToMatch(expectedVM)
    })
  })

  const givenStockIs = (stock: Stock) => {
    productStore.stock = stock
  }

  const expectVMToMatch = (expectedVM: Partial<GetPreparationsVM>) => {
    const emptyVM: GetPreparationsVM = {
      items: {
        'Click & Collect': {
          count: 0,
          canSelect: true,
          table: {
            headers: expectedHeaders,
            items: []
          }
        },
        Colissimo: {
          count: 0,
          canSelect: true,
          table: {
            headers: expectedHeaders,
            items: []
          }
        },
        'À terminer': {
          count: 0,
          canSelect: true,
          table: {
            headers: expectedHeaders,
            items: []
          }
        },
        'À completer': {
          count: 0,
          canSelect: false,
          table: {
            headers: expectedHeaders,
            items: []
          }
        },
        'À expedier': {
          count: 0,
          canSelect: false,
          table: {
            headers: expectedHeaders,
            items: []
          }
        },
        'À annuler': {
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
    expect(getPreparationsVM()).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})
