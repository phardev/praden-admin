import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { Order } from '@core/entities/order'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import {
  getPreparationVM,
  GetPreparationVM
} from '@adapters/primary/view-models/get-preparation/getPreparationVM'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'

describe('Get preparation VM', () => {
  let preparationStore: any
  const headers: Array<Header> = [
    {
      name: 'Référence',
      value: 'reference'
    },
    {
      name: 'Nom',
      value: 'name'
    },
    {
      name: 'Quantité attendue',
      value: 'expectedQuantity'
    },
    {
      name: 'Quantité préparée',
      value: 'currentQuantity'
    }
  ]
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is a preparation', () => {
    describe('Initially', () => {
      it('should get the preparation vm for a preparation', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare1.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 2,
              currentQuantity: 0
            }
          ]
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
      it('should get the preparation vm for another preparation', () => {
        givenCurrentPreparationIs(orderToPrepare2)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare2.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 1,
              currentQuantity: 0
            },
            {
              reference: ultraLevure.cip13,
              name: ultraLevure.name,
              expectedQuantity: 2,
              currentQuantity: 0
            }
          ]
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
    })
  })
  describe('There is no current preparation', () => {
    it('should return an empty vm', () => {
      const emptyVM: GetPreparationVM = {
        reference: '',
        headers: [],
        lines: []
      }
      expect(getPreparationVM()).toStrictEqual(emptyVM)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }
})
