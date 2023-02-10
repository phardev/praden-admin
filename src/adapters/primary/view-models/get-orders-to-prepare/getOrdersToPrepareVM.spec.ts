import {
  GetOrdersToPrepareVM,
  getOrdersToPrepareVM
} from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'

describe('Get orders to prepare VM', () => {
  let preparationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no orders to prepare', () => {
    it('should list nothing', () => {
      const expectedVM = {
        headers: ['Référence', 'Client', 'Date', 'Total TTC'],
        items: []
      }
      const vm = getOrdersToPrepareVM()
      expect(vm).toStrictEqual(expectedVM)
    })
  })
  describe('There is some orders to prepare', () => {
    it('should list all of them', () => {
      preparationStore.items = [orderToPrepare1, orderToPrepare2]
      const expectedVM: GetOrdersToPrepareVM = {
        headers: ['Référence', 'Client', 'Date', 'Total TTC'],
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
      const vm = getOrdersToPrepareVM()
      expect(vm).toStrictEqual(expectedVM)
    })
  })
})
