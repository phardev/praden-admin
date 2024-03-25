import { createPinia, setActivePinia } from 'pinia'
import { usePreparationStore } from '@store/preparationStore'
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { Order } from '@core/entities/order'
import {
  orderDelivered1,
  orderDelivered2,
  orderInPreparation1,
  orderNotPayed1,
  orderPrepared1,
  orderToPrepare1,
  orderToPrepare2,
  orderWithMissingProduct1
} from '@utils/testData/orders'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { useProductStore } from '@store/productStore'
import { Product, Stock } from '@core/entities/product'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'

describe('List orders to prepare', () => {
  let preparationStore: any
  let productStore: any
  let orderGateway: InMemoryOrderGateway
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
    productStore = useProductStore()
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
    productGateway = new InMemoryProductGateway()
  })

  describe('There is no orders to prepare', () => {
    beforeEach(async () => {
      await whenListOrdersToPrepare()
    })
    it('should list nothing', async () => {
      expectPreparationStoreToContains()
    })
    it('should not list products', () => {
      expectProductStoreToContains()
    })
    it('should not have stock', () => {
      expectStockToContains({})
    })
  })
  describe('There is some orders to prepare', () => {
    describe('All orders need to be prepared', () => {
      beforeEach(async () => {
        givenExistingOrders(orderToPrepare1, orderToPrepare2)
        givenExistingProducts(dolodent, chamomilla, ultraLevure)
        await whenListOrdersToPrepare()
      })
      it('should list all of them', () => {
        expectPreparationStoreToContains(orderToPrepare1, orderToPrepare2)
      })
      it('should list all products', async () => {
        expectProductStoreToContains(dolodent, ultraLevure)
      })
    })
    it('should list orders if all items are processing', async () => {
      givenExistingOrders(orderInPreparation1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains(orderInPreparation1)
    })
    it('should list orders if at least one item is still processing', async () => {
      givenExistingOrders(orderWithMissingProduct1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains(orderWithMissingProduct1)
    })
  })
  describe('There is some orders to not prepare', () => {
    it('should not list orders if all items are shipped', async () => {
      givenExistingOrders(orderPrepared1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
    it('should not list orders if all items are delivered', async () => {
      givenExistingOrders(orderDelivered1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
    it('should not list orders if they are not payed', async () => {
      givenExistingOrders(orderNotPayed1)
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains()
    })
  })

  describe('With lot of orders', () => {
    it('should list only preparable orders', async () => {
      givenExistingOrders(
        orderPrepared1,
        orderDelivered1,
        orderToPrepare1,
        orderInPreparation1,
        orderToPrepare2,
        orderWithMissingProduct1,
        orderDelivered2
      )
      await whenListOrdersToPrepare()
      expectPreparationStoreToContains(
        orderToPrepare1,
        orderInPreparation1,
        orderToPrepare2,
        orderWithMissingProduct1
      )
    })
  })

  const givenExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
  }

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }

  const whenListOrdersToPrepare = async () => {
    await listOrdersToPrepare(orderGateway, productGateway)
  }

  const expectPreparationStoreToContains = (
    ...expectedOrders: Array<Order>
  ) => {
    expect(preparationStore.items).toStrictEqual(expectedOrders)
  }

  const expectProductStoreToContains = (
    ...expectedProducts: Array<Product>
  ) => {
    expect(productStore.items).toStrictEqual(expectedProducts)
  }

  const expectStockToContains = (expectedStock: Stock) => {
    expect(productStore.stock).toStrictEqual(expectedStock)
  }
})
