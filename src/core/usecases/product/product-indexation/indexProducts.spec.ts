import { FakeSearchGateway } from '@adapters/secondary/search-gateways/FakeSearchGateway'
import { beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useIndexStore } from '@store/indexStore'
import { indexProducts } from '@core/usecases/product/product-indexation/indexProducts'

describe('Index products', () => {
  let indexStore: any
  let searchGateway: FakeSearchGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    indexStore = useIndexStore()
    searchGateway = new FakeSearchGateway()
  })

  it('should return the number of indexed products', async () => {
    await whenIndexProducts(10, 0)
    expectIndexedProductsToBeLength(10)
  })

  const whenIndexProducts = async (limit: number, offset: number) => {
    await indexProducts(limit, offset, searchGateway)
  }

  const expectIndexedProductsToBeLength = (expected: number) => {
    expect(indexStore.indexedProducts).toBe(expected)
  }
})
