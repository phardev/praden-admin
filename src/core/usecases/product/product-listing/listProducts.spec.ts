import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '@store/productStore'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { listProducts } from './listProducts'
import { Product, Stock } from '@core/entities/product'
import {
  anaca3Minceur,
  chamomilla,
  dolodent,
  ultraLevure
} from '@utils/testData/products'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { beforeEach, describe } from 'vitest'

describe('List products', () => {
  let productStore: any
  let productGateway: InMemoryProductGateway
  const defaultLimit = 50
  const defaultOffset = 0

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
  })
  describe('There is no products', () => {
    beforeEach(async () => {
      await whenListProducts()
    })
    it('should list nothing', () => {
      expectProductStoreToContains()
    })
    it('should be aware that its over', () => {
      expectHasMoreToBe(false)
    })
  })
  describe('There is some products', () => {
    beforeEach(async () => {
      givenExistingProducts(dolodent, ultraLevure)
      await whenListProducts()
    })
    it('should list all of them', () => {
      expectProductStoreToContains(dolodent, ultraLevure)
    })
    it('should retrieve available stock', async () => {
      const expectedStock: Stock = {
        [dolodent.ean13]: dolodent.availableStock,
        [ultraLevure.ean13]: ultraLevure.availableStock
      }
      expectStockToEqual(expectedStock)
    })
  })

  describe('List by chunk', () => {
    beforeEach(() => {
      givenExistingProducts(dolodent, ultraLevure, anaca3Minceur, chamomilla)
    })
    describe('Retreive first products', () => {
      beforeEach(async () => {
        await whenListProducts(2, 0)
      })
      it('should retrieve first products', () => {
        expectProductStoreToContains(dolodent, ultraLevure)
      })
      it('should be aware that its not over', () => {
        expectHasMoreToBe(true)
      })
    })
    it('should retrieve products with an offset', async () => {
      await whenListProducts(1, 2)
      expectProductStoreToContains(anaca3Minceur)
    })
    describe('Get all by chunk', () => {
      beforeEach(async () => {
        await whenListProducts(2, 0)
        await whenListProducts(2, 2)
        await whenListProducts(2, 4)
      })
      it('should retrieve multiple chunks and keep the old products', () => {
        expectProductStoreToContains(
          dolodent,
          ultraLevure,
          anaca3Minceur,
          chamomilla
        )
      })
      it('should be aware that its over', () => {
        expectHasMoreToBe(false)
      })
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      givenExistingProducts(dolodent, ultraLevure)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = productStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListProducts()
    })
    it('should be aware that loading is over', async () => {
      await whenListProducts()
      expect(productStore.isLoading).toBe(false)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }

  const whenListProducts = async (limit?: number, offset?: number) => {
    await listProducts(
      limit || defaultLimit,
      offset || defaultOffset,
      productGateway
    )
  }

  const expectProductStoreToContains = (...products: Array<Product>) => {
    expect(productStore.items).toStrictEqual(products)
  }

  const expectStockToEqual = (expectedStock: Stock) => {
    expect(productStore.stock).toStrictEqual(expectedStock)
  }

  const expectHasMoreToBe = (hasMore: boolean) => {
    expect(productStore.hasMore).toBe(hasMore)
  }
})
