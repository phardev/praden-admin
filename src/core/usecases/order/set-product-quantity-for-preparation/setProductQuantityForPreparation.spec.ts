import { dolodent, ultraLevure } from '@utils/testData/products'
import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
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
        whenSetProductQuantityForPreparation(dolodent.cip13, 1)
      ).toThrow(NoPreparationSelectedError)
    })
  })
  describe('There is a current preparation', () => {
    describe('There still need to add product', () => {
      it('should set prepared quantity to 1 if the quantity is 0', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare1))
        expectedOrder.lines[0].preparedQuantity = 1
        whenSetProductQuantityForPreparation(dolodent.cip13, 1)
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should set prepared quantity to 2 if the quantity is 0', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].preparedQuantity = 2
        whenSetProductQuantityForPreparation(dolodent.cip13, 2)
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should set prepared quantity to 1 if the quantity is 3', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 3
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].preparedQuantity = 1
        whenSetProductQuantityForPreparation(dolodent.cip13, 1)
        expectCurrentPreparationToBe(expectedOrder)
      })
    })
  })

  describe('For another preparation', () => {
    it('should set quantity for another product', () => {
      givenCurrentPreparationIs(orderToPrepare2)
      const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare2))
      expectedOrder.lines[1].preparedQuantity = 1
      whenSetProductQuantityForPreparation(ultraLevure.cip13, 1)
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  describe('The product is not in the preparation', () => {
    it('should do nothing', () => {
      givenCurrentPreparationIs(orderToPrepare1)
      whenSetProductQuantityForPreparation(ultraLevure.cip13, 2)
      expectCurrentPreparationToBe(orderToPrepare1)
    })
  })

  describe('The product is already prepared', () => {
    it('should do nothing', () => {
      const order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      givenCurrentPreparationIs(order)
      whenSetProductQuantityForPreparation(dolodent.cip13, 3)
      const expectedOrder = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].preparedQuantity = 3
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  // describe('Add more than one', () => {
  //   it('should add the quantity ', () => {
  //     const order = JSON.parse(JSON.stringify(orderToPrepare1))
  //     givenCurrentPreparationIs(order)
  //     whenAddProductToPreparation(dolodent.cip13, 2)
  //     const expectedOrder = JSON.parse(JSON.stringify(order))
  //     expectedOrder.lines[0].preparedQuantity = 2
  //     expectCurrentPreparationToBe(expectedOrder)
  //   })
  // })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }

  const whenSetProductQuantityForPreparation = (
    cip13: string,
    quantity: number
  ) => {
    setProductQuantityForPreparation(cip13, quantity)
  }

  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }
})
