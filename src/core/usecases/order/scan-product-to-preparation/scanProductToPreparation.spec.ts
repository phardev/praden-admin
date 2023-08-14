import { dolodent, ultraLevure } from '@utils/testData/products'
import { scanProductToPreparation } from '@core/usecases/order/scan-product-to-preparation/scanProductToPreparation'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { Order } from '@core/entities/order'

describe('Scan product to preparation', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no current preparation', () => {
    it('should throw an error', () => {
      expect(() => whenAddProductToPreparation(dolodent.cip13)).toThrow(
        NoPreparationSelectedError
      )
    })
  })
  describe('There is a current preparation', () => {
    describe('There still need to add product', () => {
      it('should set prepared quantity to 1 if the quantity is 0', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare1))
        expectedOrder.lines[0].preparedQuantity = 1
        whenAddProductToPreparation(dolodent.cip13)
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should add 1 to the prepared quantity if the quantity is > 0', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 1
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].preparedQuantity = 2
        whenAddProductToPreparation(dolodent.cip13)
        expectCurrentPreparationToBe(expectedOrder)
      })
    })
  })

  describe('For another preparation', () => {
    it('should add another product required', () => {
      givenCurrentPreparationIs(orderToPrepare2)
      const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare2))
      expectedOrder.lines[1].preparedQuantity = 1
      whenAddProductToPreparation(ultraLevure.cip13)
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  describe('The product is not in the preparation', () => {
    it('should do nothing', () => {
      givenCurrentPreparationIs(orderToPrepare1)
      whenAddProductToPreparation(ultraLevure.cip13)
      expectCurrentPreparationToBe(orderToPrepare1)
    })
  })

  describe('The product is already prepared', () => {
    it('should do nothing', () => {
      const order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      givenCurrentPreparationIs(order)
      whenAddProductToPreparation(dolodent.cip13)
      const expectedOrder = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].preparedQuantity++
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }

  const whenAddProductToPreparation = (cip13: string) => {
    scanProductToPreparation(cip13)
  }

  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }
})
