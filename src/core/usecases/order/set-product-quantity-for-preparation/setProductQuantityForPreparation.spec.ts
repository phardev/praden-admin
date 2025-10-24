import { Order } from '@core/entities/order'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { setProductQuantityForPreparation } from '@core/usecases/order/set-product-quantity-for-preparation/setProductQuantityForPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Set product quantity for preparation', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no current preparation', () => {
    it('should throw an error', () => {
      expect(() =>
        whenChangeProductQuantityForPreparation(dolodent.ean13, 2)
      ).toThrow(NoPreparationSelectedError)
    })
  })
  describe('There is a current preparation', () => {
    describe('There is actually 0 quantity', () => {
      it('should set prepared quantity to 1', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare1))
        expectedOrder.lines[0].preparedQuantity = 1
        whenChangeProductQuantityForPreparation(dolodent.ean13, 1)
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should set the prepared quantity to 5', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].preparedQuantity = 5
        whenChangeProductQuantityForPreparation(dolodent.ean13, 5)
        expectCurrentPreparationToBe(expectedOrder)
      })
    })
  })

  describe('For another preparation', () => {
    it('should add another product required', () => {
      givenCurrentPreparationIs(orderToPrepare2)
      const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare2))
      expectedOrder.lines[1].preparedQuantity = 1
      whenChangeProductQuantityForPreparation(ultraLevure.ean13, 1)
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  describe('The product is not in the preparation', () => {
    it('should do nothing', () => {
      givenCurrentPreparationIs(orderToPrepare1)
      whenChangeProductQuantityForPreparation(ultraLevure.ean13, 1)
      expectCurrentPreparationToBe(orderToPrepare1)
    })
  })

  describe('The product is already prepared', () => {
    it('should set the quantity', () => {
      const order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      givenCurrentPreparationIs(order)
      whenChangeProductQuantityForPreparation(dolodent.ean13, 123)
      const expectedOrder = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].preparedQuantity = 123
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }

  const whenChangeProductQuantityForPreparation = (
    ean13: string,
    quantity: number
  ) => {
    setProductQuantityForPreparation(ean13, quantity)
  }

  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }
})
