import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Stock } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import {
  anaca3MinceurListItem,
  chamomillaListItem,
  dolodentListItem,
  ultraLevureListItem
} from '@utils/testData/fixtures/products/productListItems'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe } from 'vitest'
import { listProducts } from './listProducts'
import { ProductListItem } from './productListItem'

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
      givenExistingProducts(dolodentListItem, ultraLevureListItem)
      await whenListProducts()
    })
    it('should list all of them', () => {
      expectProductStoreToContains(dolodentListItem, ultraLevureListItem)
    })
    it('should retrieve available stock', async () => {
      const expectedStock: Stock = {
        [dolodentListItem.ean13]: dolodentListItem.availableStock,
        [ultraLevureListItem.ean13]: ultraLevureListItem.availableStock
      }
      expectStockToEqual(expectedStock)
    })
  })

  describe('List by chunk', () => {
    beforeEach(() => {
      givenExistingProducts(
        dolodentListItem,
        ultraLevureListItem,
        anaca3MinceurListItem,
        chamomillaListItem
      )
    })
    describe('Retreive first products', () => {
      beforeEach(async () => {
        await whenListProducts(2, 0)
      })
      it('should retrieve first products', () => {
        expectProductStoreToContains(dolodentListItem, ultraLevureListItem)
      })
      it('should be aware that its not over', () => {
        expectHasMoreToBe(true)
      })
    })
    it('should retrieve products with an offset', async () => {
      await whenListProducts(1, 2)
      expectProductStoreToContains(anaca3MinceurListItem)
    })
    describe('Get all by chunk', () => {
      beforeEach(async () => {
        await whenListProducts(2, 0)
        await whenListProducts(2, 2)
        await whenListProducts(2, 4)
      })
      it('should retrieve multiple chunks and keep the old products', () => {
        expectProductStoreToContains(
          dolodentListItem,
          ultraLevureListItem,
          anaca3MinceurListItem,
          chamomillaListItem
        )
      })
      it('should be aware that its over', () => {
        expectHasMoreToBe(false)
      })
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      givenExistingProducts(dolodentListItem, ultraLevureListItem)
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
    it('should prevent duplicate concurrent requests', async () => {
      productStore.startLoading()
      await whenListProducts()
      expectProductStoreToContains()
    })
  })

  const givenExistingProducts = (...products: Array<ProductListItem>) => {
    productGateway.feedListItemsWith(...products)
  }

  const whenListProducts = async (limit?: number, offset?: number) => {
    await listProducts(
      limit || defaultLimit,
      offset || defaultOffset,
      productGateway
    )
  }

  const expectProductStoreToContains = (
    ...products: Array<ProductListItem>
  ) => {
    expect(productStore.items).toStrictEqual(products)
  }

  const expectStockToEqual = (expectedStock: Stock) => {
    expect(productStore.stock).toStrictEqual(expectedStock)
  }

  const expectHasMoreToBe = (hasMore: boolean) => {
    expect(productStore.hasMore).toBe(hasMore)
  }
})
