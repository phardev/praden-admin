import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Order } from '@core/entities/order'
import { Product, Stock } from '@core/entities/product'
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { usePreparationStore } from '@store/preparationStore'
import { useProductStore } from '@store/productStore'
import {
  orderDelivered1,
  orderDelivered2,
  orderInPreparation1,
  orderNotPayed1,
  orderPrepared1,
  orderToPrepare1,
  orderToPrepare2,
  orderWithMissingProduct1,
  orderWithoutPayment
} from '@utils/testData/orders'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

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
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
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
        expectProductStoreToContains(
          toListItem(dolodent),
          toListItem(ultraLevure)
        )
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
      givenExistingOrders(orderNotPayed1, orderWithoutPayment)
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
  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = preparationStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListOrdersToPrepare()
    })
    it('should be aware when loading is done', async () => {
      await whenListOrdersToPrepare()
      expect(preparationStore.isLoading).toBe(false)
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
    ...expectedProducts: Array<ProductListItem>
  ) => {
    expect(productStore.items).toStrictEqual(expectedProducts)
  }

  const expectStockToContains = (expectedStock: Stock) => {
    expect(productStore.stock).toStrictEqual(expectedStock)
  }

  const toListItem = (product: Product): ProductListItem => {
    const listItem: ProductListItem = {
      uuid: product.uuid,
      name: product.name,
      ean13: product.ean13,
      categories: product.categories.map((c) => ({
        uuid: c.uuid,
        name: c.name
      })),
      priceWithoutTax: product.priceWithoutTax,
      percentTaxRate: product.percentTaxRate,
      availableStock: product.availableStock,
      status: product.status,
      flags: product.flags,
      miniature: product.miniature,
      isMedicine: product.isMedicine
    }
    if (product.laboratory) {
      listItem.laboratory = {
        uuid: product.laboratory.uuid,
        name: product.laboratory.name
      }
    }
    return listItem
  }
})
