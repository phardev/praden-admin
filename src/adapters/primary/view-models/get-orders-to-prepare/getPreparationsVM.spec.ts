import {
  GetPreparationsVM,
  getPreparationsVM,
  Header
} from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'

describe('Get orders to prepare VM', () => {
  let preparationStore: any
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
  })
  describe('There is no orders to prepare', () => {
    it('should list nothing', () => {
      const expectedVM: GetPreparationsVM = {
        items: [
          {
            title: 'Click & Collect',
            count: 0,
            table: {
              headers: expectedHeaders,
              items: []
            }
          },
          {
            title: 'Livraisons',
            count: 0,
            table: {
              headers: expectedHeaders,
              items: []
            }
          },
          {
            title: 'À terminer',
            count: 0,
            table: {
              headers: expectedHeaders,
              items: []
            }
          }
        ]
      }
      const vm = getPreparationsVM()
      expect(vm).toStrictEqual(expectedVM)
    })
  })
  describe('There is some orders to prepare in click & collect', () => {
    it('should list all of them', () => {
      preparationStore.items = [orderToPrepare1, orderToPrepare2]
      const expectedVM: GetPreparationsVM = {
        items: [
          {
            title: 'Click & Collect',
            count: 2,
            table: {
              headers: expectedHeaders,
              items: [
                {
                  reference: orderToPrepare1.uuid,
                  client: 'J. Bon',
                  createdDate: '21 janv. 2023',
                  createdDatetime: new Date('2023-01-21T03:54:39.000Z'),
                  total: '11,00\u00A0€'
                },
                {
                  reference: orderToPrepare2.uuid,
                  client: "J. D'arc",
                  createdDate: '5 févr. 2023',
                  createdDatetime: new Date('2023-02-05T02:59:32.527Z'),
                  total: '15,00\u00A0€'
                }
              ]
            }
          },
          {
            title: 'Livraisons',
            count: 0,
            table: {
              headers: expectedHeaders,
              items: []
            }
          },
          {
            title: 'À terminer',
            count: 0,
            table: {
              headers: expectedHeaders,
              items: []
            }
          }
        ]
      }
      const vm = getPreparationsVM()
      expect(vm).toStrictEqual(expectedVM)
    })
  })
})
