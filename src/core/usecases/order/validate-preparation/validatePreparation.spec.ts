import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
import { validatePreparation } from '@core/usecases/order/validate-preparation/validatePreparation'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { DeliveryStatus, Order } from '@core/entities/order'
import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'
import { FakeDateProvider } from '@adapters/secondary/fakeDateProvider'

describe('Validate preparation', () => {
  let preparationStore: any
  let orderGateway: InMemoryOrderGateway
  const dateProvider = new FakeDateProvider()
  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    orderGateway = new InMemoryOrderGateway(dateProvider)
  })

  describe('The preparation is fully prepared', () => {
    const order: Order = JSON.parse(JSON.stringify(orderToPrepare1))
    const now = 1234567891234
    beforeEach(async () => {
      dateProvider.feedWith(now)
      givenThereIsExistingOrders(order)
      givenThereIsAPreparationSelected(order)
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      await whenValidatePreparation()
    })
    it('should save it', async () => {
      const expectedOrder: Order = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
      expectedOrder.lines[0].updatedAt = now
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
    })
  })
  describe('Another preparation is fully prepared', () => {
    const order: Order = JSON.parse(JSON.stringify(orderToPrepare2))
    const now = 9876543216549
    beforeEach(async () => {
      givenThereIsExistingOrders(order)
      givenThereIsAPreparationSelected(order)
      order.lines[0].preparedQuantity = order.lines[0].expectedQuantity
      order.lines[0].updatedAt = now
      order.lines[1].preparedQuantity = order.lines[1].expectedQuantity
      order.lines[1].updatedAt = now
      await whenValidatePreparation()
    })
    it('should save it', async () => {
      const expectedOrder: Order = JSON.parse(JSON.stringify(order))
      expectedOrder.lines[0].deliveryStatus = DeliveryStatus.Shipped
      expectedOrder.lines[1].deliveryStatus = DeliveryStatus.Shipped
      expect(await orderGateway.list()).toStrictEqual([expectedOrder])
    })
  })

  describe('There is no current preparation', () => {
    it('should throw an error', async () => {
      await expect(whenValidatePreparation()).rejects.toThrow(
        NoPreparationSelectedError
      )
    })
  })

  const givenThereIsExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
  }

  const givenThereIsAPreparationSelected = (order: Order) => {
    preparationStore.current = order
  }

  const whenValidatePreparation = async () => {
    await validatePreparation(orderGateway)
  }
})
