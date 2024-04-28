import { dolodent, ultraLevure } from '@utils/testData/products'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { Order } from '@core/entities/order'
import { changeProductCip13ForPreparation } from '@core/usecases/order/change-product-cip13-for-preparation/changeProductCip13ForPreparation'

describe('Change product reference for preparation', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no current preparation', () => {
    it('should throw an error', () => {
      expect(() =>
        whenChangeProductReferenceForPreparation(dolodent.cip13, '123456')
      ).toThrow(NoPreparationSelectedError)
    })
  })
  describe('There is a current preparation', () => {
    describe('There is existing cip13', () => {
      it('should set the new cip13', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare1))
        expectedOrder.lines[0].cip13 = '1234567890123'
        whenChangeProductReferenceForPreparation(
          dolodent.cip13,
          '1234567890123'
        )
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should set another cip13', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].cip13 = '0987654321098'
        whenChangeProductReferenceForPreparation(
          dolodent.cip13,
          '0987654321098'
        )
        expectCurrentPreparationToBe(expectedOrder)
      })
    })
  })

  describe('For another preparation', () => {
    it('should set the cip13', () => {
      givenCurrentPreparationIs(orderToPrepare2)
      const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare2))
      expectedOrder.lines[1].cip13 = '1234567890123'
      whenChangeProductReferenceForPreparation(
        ultraLevure.cip13,
        '1234567890123'
      )
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  describe('The product is not in the preparation', () => {
    it('should do nothing', () => {
      givenCurrentPreparationIs(orderToPrepare1)
      whenChangeProductReferenceForPreparation(
        ultraLevure.cip13,
        '1234567890123'
      )
      expectCurrentPreparationToBe(orderToPrepare1)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }

  const whenChangeProductReferenceForPreparation = (
    oldCip13: string,
    newCip13: string
  ) => {
    changeProductCip13ForPreparation(oldCip13, newCip13)
  }

  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }
})
