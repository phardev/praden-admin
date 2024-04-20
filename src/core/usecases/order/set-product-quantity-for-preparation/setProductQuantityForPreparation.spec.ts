import { dolodent, ultraLevure } from '@utils/testData/products'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { Order } from '@core/entities/order'
import { setProductQuantityForPreparation } from '@core/usecases/order/set-product-quantity-for-preparation/setProductQuantityForPreparation'

describe('Set product quantity for preparation', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no current preparation', () => {
    it('should throw an error', () => {
      expect(() =>
        whenChangeProductQuantityForPreparation(dolodent.cip13, 2)
      ).toThrow(NoPreparationSelectedError)
    })
  })
  describe('There is a current preparation', () => {
    describe('There is actually 0 quantity', () => {
      it('should set prepared quantity to 1', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare1))
        expectedOrder.lines[0].preparedQuantity = 1
        whenChangeProductQuantityForPreparation(dolodent.cip13, 1)
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should set the prepared quantity to 5', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].preparedQuantity = 5
        whenChangeProductQuantityForPreparation(dolodent.cip13, 5)
        expectCurrentPreparationToBe(expectedOrder)
      })
    })
  })

  describe('For another preparation', () => {
    it('should add another product required', () => {
      givenCurrentPreparationIs(orderToPrepare2)
      const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare2))
      expectedOrder.lines[1].preparedQuantity = 1
      whenChangeProductQuantityForPreparation(ultraLevure.cip13, 1)
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  describe('The product is not in the preparation', () => {
    it('should do nothing', () => {
      givenCurrentPreparationIs(orderToPrepare1)
      whenChangeProductQuantityForPreparation(ultraLevure.cip13, 1)
      expectCurrentPreparationToBe(orderToPrepare1)
    })
  })

  describe('The product is already prepared', () => {
    it('should set the quantity', () => {
      const order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      givenCurrentPreparationIs(order)
      whenChangeProductQuantityForPreparation(dolodent.cip13, 123)
      const expectedOrder = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].preparedQuantity = 123
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }

  const whenChangeProductQuantityForPreparation = (
    cip13: string,
    quantity: number
  ) => {
    setProductQuantityForPreparation(cip13, quantity)
  }

  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }
})
