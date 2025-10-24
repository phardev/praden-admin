import { Order } from '@core/entities/order'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { changeProductEan13ForPreparation } from '@core/usecases/order/change-product-ean13-for-preparation/changeProductEan13ForPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Change product reference for preparation', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no current preparation', () => {
    it('should throw an error', () => {
      expect(() =>
        whenChangeProductReferenceForPreparation(dolodent.ean13, '123456')
      ).toThrow(NoPreparationSelectedError)
    })
  })
  describe('There is a current preparation', () => {
    describe('There is existing ean13', () => {
      it('should set the new ean13', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare1))
        expectedOrder.lines[0].ean13 = '1234567890123'
        whenChangeProductReferenceForPreparation(
          dolodent.ean13,
          '1234567890123'
        )
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should set another ean13', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].ean13 = '0987654321098'
        whenChangeProductReferenceForPreparation(
          dolodent.ean13,
          '0987654321098'
        )
        expectCurrentPreparationToBe(expectedOrder)
      })
    })
  })

  describe('For another preparation', () => {
    it('should set the ean13', () => {
      givenCurrentPreparationIs(orderToPrepare2)
      const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare2))
      expectedOrder.lines[1].ean13 = '1234567890123'
      whenChangeProductReferenceForPreparation(
        ultraLevure.ean13,
        '1234567890123'
      )
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  describe('The product is not in the preparation', () => {
    it('should do nothing', () => {
      givenCurrentPreparationIs(orderToPrepare1)
      whenChangeProductReferenceForPreparation(
        ultraLevure.ean13,
        '1234567890123'
      )
      expectCurrentPreparationToBe(orderToPrepare1)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }

  const whenChangeProductReferenceForPreparation = (
    oldEan13: string,
    newEan13: string
  ) => {
    changeProductEan13ForPreparation(oldEan13, newEan13)
  }

  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }
})
