import { Order } from '@core/entities/order'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import {
  PreparationError,
  PreparationErrorType,
  scanProductToPreparation
} from '@core/usecases/order/scan-product-to-preparation/scanProductToPreparation'
import { usePreparationStore } from '@store/preparationStore'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Scan product to preparation', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no current preparation', () => {
    it('should throw an error', () => {
      expect(() => whenAddProductToPreparation(dolodent.ean13)).toThrow(
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
        whenAddProductToPreparation(dolodent.ean13)
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should add 1 to the prepared quantity if the quantity is > 0', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 1
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].preparedQuantity = 2
        whenAddProductToPreparation(dolodent.ean13)
        expectCurrentPreparationToBe(expectedOrder)
      })
    })
  })

  describe('For another preparation', () => {
    it('should add another product required', () => {
      givenCurrentPreparationIs(orderToPrepare2)
      const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare2))
      expectedOrder.lines[1].preparedQuantity = 1
      whenAddProductToPreparation(ultraLevure.ean13)
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  describe('The product is not in the preparation', () => {
    it('should do nothing the preparation', () => {
      givenCurrentPreparationIs(orderToPrepare1)
      whenAddProductToPreparation(ultraLevure.ean13)
      expectCurrentPreparationToBe(orderToPrepare1)
    })
    it('should create an error', () => {
      givenCurrentPreparationIs(orderToPrepare1)
      whenAddProductToPreparation(ultraLevure.ean13)
      const error: PreparationError = {
        type: PreparationErrorType.ProductNotInPreparationError,
        value: ultraLevure.ean13
      }
      expectPreparationErrorToBe(error)
    })
  })

  describe('The product is already prepared', () => {
    it('should do nothing', () => {
      const order = JSON.parse(JSON.stringify(orderToPrepare1))
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      givenCurrentPreparationIs(order)
      whenAddProductToPreparation(dolodent.ean13)
      const expectedOrder = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].preparedQuantity++
      expectCurrentPreparationToBe(expectedOrder)
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = order
  }

  const whenAddProductToPreparation = (ean13: string) => {
    scanProductToPreparation(ean13)
  }

  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }

  const expectPreparationErrorToBe = (error: PreparationError) => {
    expect(preparationStore.error).toStrictEqual(error)
  }
})
