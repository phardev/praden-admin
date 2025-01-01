import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import {
  orderToPrepare1,
  orderToPrepare2,
  orderWithMissingProduct1
} from '@utils/testData/orders'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { OrderLineStatus, Order, OrderLine } from '@core/entities/order'
import { savePreparation } from '@core/usecases/order/save-preparation/savePreparation'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { PreparationDoesNotExistsError } from '@core/errors/PreparationDoesNotExistsError'
import { OrderLineAlreadyProcessedError } from '@core/errors/OrderLineAlreadyProcessedError'

describe('Save preparation', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway
  const dateProvider = new FakeDateProvider()
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    orderGateway = new InMemoryOrderGateway(dateProvider)
  })
  describe('There is existing not started preparations', () => {
    beforeEach(() => {
      givenThereIsExistingPreparations(orderToPrepare1, orderToPrepare2)
    })
    describe('There is a current preparation', () => {
      describe('For a preparation', () => {
        let expectedPrep: Order
        beforeEach(async () => {
          const now = 123456789
          dateProvider.feedWith(now)
          const currentPreparation = JSON.parse(JSON.stringify(orderToPrepare1))
          currentPreparation.lines[0].preparedQuantity = 1
          givenThereIsACurrentPreparation(currentPreparation)
          expectedPrep = JSON.parse(JSON.stringify(currentPreparation))
          expectedPrep.lines[0].updatedAt = now
          expectedPrep.lines.forEach((l: OrderLine) => {
            l.status = OrderLineStatus.Started
          })
          await whenSaveCurrentPreparation()
        })
        it('should save changes in order gateway', async () => {
          await expectOrderGatewayToEqual(expectedPrep, orderToPrepare2)
        })
        it('should save changes in preparation store', () => {
          expectPreparationStoreToEqual(expectedPrep, orderToPrepare2)
        })
      })
      describe('For another preparation', () => {
        let expectedPrep: Order
        beforeEach(async () => {
          const now = 987654321
          dateProvider.feedWith(now)
          const currentPreparation = JSON.parse(JSON.stringify(orderToPrepare2))
          currentPreparation.lines[1].preparedQuantity = 2
          givenThereIsACurrentPreparation(currentPreparation)
          expectedPrep = JSON.parse(JSON.stringify(currentPreparation))
          expectedPrep.lines[1].updatedAt = now
          expectedPrep.lines.forEach((l: OrderLine) => {
            l.status = OrderLineStatus.Started
          })
          await whenSaveCurrentPreparation()
        })
        it('should update only changed lines', async () => {
          await expectOrderGatewayToEqual(orderToPrepare1, expectedPrep)
        })
        it('should save changes in preparation store', () => {
          expectPreparationStoreToEqual(orderToPrepare1, expectedPrep)
        })
      })
    })
    describe('For an already partially prepared preparation', () => {
      let expectedPrep: Order
      const now = 987654321
      beforeEach(async () => {
        dateProvider.feedWith(now)
      })
      it('should not update shipped lines', async () => {
        const currentPreparation = JSON.parse(
          JSON.stringify(orderWithMissingProduct1)
        )
        givenThereIsExistingPreparations(orderWithMissingProduct1)
        currentPreparation.lines[1].preparedQuantity = 2
        givenThereIsACurrentPreparation(currentPreparation)
        expectedPrep = JSON.parse(JSON.stringify(currentPreparation))
        expectedPrep.lines[1].updatedAt = now
        expectedPrep.lines[1].status = OrderLineStatus.Started
        await whenSaveCurrentPreparation()
        await expectOrderGatewayToEqual(expectedPrep)
      })
      it('should throw an error when trying to update shipped lines', async () => {
        const currentPreparation = JSON.parse(
          JSON.stringify(orderWithMissingProduct1)
        )
        givenThereIsExistingPreparations(orderWithMissingProduct1)
        currentPreparation.lines[0].preparedQuantity = 1
        givenThereIsACurrentPreparation(currentPreparation)
        await expect(whenSaveCurrentPreparation()).rejects.toThrow(
          OrderLineAlreadyProcessedError
        )
      })
    })
    describe('There is no current preparation', () => {
      it('should throw an error', async () => {
        givenThereNoCurrentPreparation()
        await expect(whenSaveCurrentPreparation()).rejects.toThrow(
          NoPreparationSelectedError
        )
      })
    })
    describe('The preparation does not exists', () => {
      it('should throw an error', async () => {
        const current = JSON.parse(JSON.stringify(orderToPrepare1))
        current.uuid = 'NotExists'
        givenThereIsACurrentPreparation(current)
        await expect(whenSaveCurrentPreparation()).rejects.toThrow(
          PreparationDoesNotExistsError
        )
      })
    })
  })

  const givenThereIsExistingPreparations = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
    preparationStore.items = orders
  }

  const givenThereIsACurrentPreparation = (order: Order) => {
    preparationStore.current = order
  }

  const givenThereNoCurrentPreparation = () => {
    preparationStore.current = undefined
  }

  const whenSaveCurrentPreparation = async () => {
    await savePreparation(orderGateway)
  }

  const expectOrderGatewayToEqual = async (...orders: Array<Order>) => {
    expect(await orderGateway.list()).toStrictEqual(orders)
  }

  const expectPreparationStoreToEqual = (...orders: Array<Order>) => {
    expect(preparationStore.items).toStrictEqual(orders)
  }
})
