import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { removeProductFromPreparation } from '@core/usecases/order/scan-product-to-remove-fom-preparation/scanProductToRemoveFromPreparation'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { Order } from '@core/entities/order'

describe('Scan product to remove from preparation', () => {
  let preparationStore: any
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })
  describe('There is no current preparation', () => {
    it('should throw an error', () => {
      expect(() => whenRemoveProductFromPreparation(dolodent.ean13)).toThrow(
        NoPreparationSelectedError
      )
    })
  })
  describe('There is a current preparation', () => {
    describe('There is a prepared quantity', () => {
      it('should set prepared quantity to 0 if the quantity is 1', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 1
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(orderToPrepare1))
        expectedOrder.lines[0].preparedQuantity = 0
        whenRemoveProductFromPreparation(dolodent.ean13)
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should remove 1 to the prepared quantity if the quantity is > 1', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare1))
        order.lines[0].preparedQuantity = 2
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[0].preparedQuantity = 1
        whenRemoveProductFromPreparation(dolodent.ean13)
        expectCurrentPreparationToBe(expectedOrder)
      })
      it('should remove from another preparation', () => {
        const order = JSON.parse(JSON.stringify(orderToPrepare2))
        order.lines[1].preparedQuantity = 2
        givenCurrentPreparationIs(order)
        const expectedOrder = JSON.parse(JSON.stringify(order))
        expectedOrder.lines[1].preparedQuantity = 1
        whenRemoveProductFromPreparation(ultraLevure.ean13)
        expectCurrentPreparationToBe(expectedOrder)
      })
    })
    describe('There is no prepared quantity', () => {
      it('should do nothing', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        whenRemoveProductFromPreparation(dolodent.ean13)
        expectCurrentPreparationToBe(orderToPrepare1)
      })
    })
    describe('The product is not in the preparation', () => {
      it('should do nothing', () => {
        givenCurrentPreparationIs(orderToPrepare1)
        whenRemoveProductFromPreparation(ultraLevure.ean13)
        expectCurrentPreparationToBe(orderToPrepare1)
      })
    })
  })

  const givenCurrentPreparationIs = (order: Order) => {
    preparationStore.current = JSON.parse(JSON.stringify(order))
  }

  const whenRemoveProductFromPreparation = (ean13: string) => {
    removeProductFromPreparation(ean13)
  }

  const expectCurrentPreparationToBe = (order: Order) => {
    expect(preparationStore.current).toStrictEqual(order)
  }
})
