import { createPinia, setActivePinia } from 'pinia'
import { InMemoryOrderGateway } from '@adapters/secondary/inMemoryOrderGateway'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { DeliveryStatus, Order, OrderLine } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { startPreparations } from '@core/usecases/order/start-preparations/startPreparations'
import { usePreparationStore } from '@store/preparationStore'
import { FakeDateProvider } from '@adapters/secondary/fakeDateProvider'

describe('Start preparations', () => {
  let orderGateway: InMemoryOrderGateway
  let preparationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
    preparationStore = usePreparationStore()
  })

  describe('Existing orders', () => {
    const expectedOrder1 = JSON.parse(JSON.stringify(orderToPrepare1))
    expectedOrder1.lines.forEach(
      (l: OrderLine) => (l.deliveryStatus = DeliveryStatus.Processing)
    )
    const expectedOrder2 = JSON.parse(JSON.stringify(orderToPrepare2))
    expectedOrder2.lines.forEach(
      (l: OrderLine) => (l.deliveryStatus = DeliveryStatus.Processing)
    )
    beforeEach(() => {
      givenThereIsOrdersToPrepare(orderToPrepare1, orderToPrepare2)
    })
    describe('Prepare all orders', () => {
      beforeEach(async () => {
        await whenStartPreparationForOrders(
          orderToPrepare1.uuid,
          orderToPrepare2.uuid
        )
      })
      it('should set each order line to processing', async () => {
        await expectOrdersToEqual(expectedOrder1, expectedOrder2)
      })
      it('should update preparation store', () => {
        expectPreparationStoreToEqual(expectedOrder1, expectedOrder2)
      })
    })
    describe('Prepare one order', () => {
      beforeEach(async () => {
        await whenStartPreparationForOrders(orderToPrepare1.uuid)
      })
      it('should set each order line to processing', async () => {
        await expectOrdersToEqual(expectedOrder1, orderToPrepare2)
      })
      it('should remove order from preparations', () => {
        expectPreparationStoreToEqual(expectedOrder1, orderToPrepare2)
      })
    })
    describe('Prepare another one order', () => {
      beforeEach(async () => {
        await whenStartPreparationForOrders(orderToPrepare2.uuid)
      })
      it('should set each order line to processing', async () => {
        await expectOrdersToEqual(orderToPrepare1, expectedOrder2)
      })
      it('should remove order from preparations', () => {
        expectPreparationStoreToEqual(orderToPrepare1, expectedOrder2)
      })
    })
  })

  const givenThereIsOrdersToPrepare = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
    preparationStore.items = orders
  }

  const whenStartPreparationForOrders = async (...ordersUuids: Array<UUID>) => {
    preparationStore.selected = ordersUuids
    await startPreparations(orderGateway)
  }

  const expectOrdersToEqual = async (...expectedOrders: Array<Order>) => {
    const orders = await orderGateway.list()
    expect(orders).toStrictEqual(expectedOrders)
  }

  const expectPreparationStoreToEqual = (...preparations: Array<Order>) => {
    expect(preparationStore.items).toStrictEqual(preparations)
  }
})
