import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { Order } from '@core/entities/order'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import {
  getPreparationVM,
  GetPreparationVM,
  PreparationStatus
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
      value: 'preparedQuantity'
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
              preparedQuantity: 0,
              status: PreparationStatus.NotPrepared
            }
          ],
          canValidate: false
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
              preparedQuantity: 0,
              status: PreparationStatus.NotPrepared
            },
            {
              reference: ultraLevure.cip13,
              name: ultraLevure.name,
              expectedQuantity: 2,
              preparedQuantity: 0,
              status: PreparationStatus.NotPrepared
            }
          ],
          canValidate: false
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
    })
    describe('Some products were scanned', () => {
      it('should get the preparation vm', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 2
        givenCurrentPreparationIs(order)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare1.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 2,
              preparedQuantity: 2,
              status: PreparationStatus.Prepared
            }
          ],
          canValidate: true
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
      it('should get the preparation vm for a partially prepared order', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare2))
        order.lines[0].preparedQuantity = 1
        order.lines[1].preparedQuantity = 1
        givenCurrentPreparationIs(order)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare2.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 1,
              preparedQuantity: 1,
              status: PreparationStatus.Prepared
            },
            {
              reference: ultraLevure.cip13,
              name: ultraLevure.name,
              expectedQuantity: 2,
              preparedQuantity: 1,
              status: PreparationStatus.NotPrepared
            }
          ],
          canValidate: false
        }
        expect(getPreparationVM()).toStrictEqual(expectedVM)
      })
      it('should get the preparation vm for an preparation with too much prepared quantity', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 3
        givenCurrentPreparationIs(order)
        const expectedVM: GetPreparationVM = {
          reference: orderToPrepare1.uuid,
          headers,
          lines: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              expectedQuantity: 2,
              preparedQuantity: 3,
              status: PreparationStatus.ErrorTooMuchQuantity
            }
          ],
          canValidate: false
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
        lines: [],
        canValidate: false
      }
      expect(getPreparationVM()).toStrictEqual(emptyVM)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }
})
