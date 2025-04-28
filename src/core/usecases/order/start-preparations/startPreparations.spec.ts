import { createPinia, setActivePinia } from 'pinia'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { orderToPrepare1, orderToPrepare2 } from '@utils/testData/orders'
import { OrderLineStatus, Order, OrderLine } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { startPreparations } from '@core/usecases/order/start-preparations/startPreparations'
import { usePreparationStore } from '@store/preparationStore'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { dolodent, ultraLevure } from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { useProductStore } from '@store/productStore'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { PreparationDoesNotExistsError } from '@core/errors/PreparationDoesNotExistsError'

describe('Start preparations', () => {
  let orderGateway: InMemoryOrderGateway
  let productGateway: InMemoryProductGateway
  let preparationStore: any
  let productStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    preparationStore = usePreparationStore()
    productStore = useProductStore()
  })

  describe('Existing orders', () => {
    const expectedOrder1 = JSON.parse(JSON.stringify(orderToPrepare1))
    expectedOrder1.lines.forEach(
      (l: OrderLine) => (l.status = OrderLineStatus.Started)
    )
    const expectedOrder2 = JSON.parse(JSON.stringify(orderToPrepare2))
    expectedOrder2.lines.forEach(
      (l: OrderLine) => (l.status = OrderLineStatus.Started)
    )
    beforeEach(() => {
      givenThereIsOrdersToPrepare(orderToPrepare1, orderToPrepare2)
      givenThereIsExistingProducts(dolodent, ultraLevure)
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
      it('should clear selection', () => {
        expectSelectionToBeEmpty()
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
    describe('Loading', () => {
      it('should be aware during loading', async () => {
        const unsubscribe = preparationStore.$subscribe(
          (mutation: any, state: any) => {
            expect(state.isLoading).toBe(true)
            unsubscribe()
          }
        )
        await whenStartPreparationForOrders(
          orderToPrepare1.uuid,
          orderToPrepare2.uuid
        )
      })
      it('should be aware when loading is done', async () => {
        await whenStartPreparationForOrders(
          orderToPrepare1.uuid,
          orderToPrepare2.uuid
        )
        expect(preparationStore.isLoading).toBe(false)
      })
    })
  })
  describe('Errors', () => {
    describe('The order does not exists', () => {
      it('should throw an error', async () => {
        await expect(
          whenStartPreparationForOrders('not-exists')
        ).rejects.toThrow(PreparationDoesNotExistsError)
      })
      it('should stop loading', async () => {
        try {
          await whenStartPreparationForOrders('not-exists')
        } catch {
          /* For testing purpose */
        }
        expect(preparationStore.isLoading).toBe(false)
      })
    })
  })
  const givenThereIsOrdersToPrepare = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
    preparationStore.items = orders
  }

  const givenThereIsExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
    productStore.items = products
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

  const expectSelectionToBeEmpty = () => {
    expect(preparationStore.selected).toStrictEqual([])
  }
})
