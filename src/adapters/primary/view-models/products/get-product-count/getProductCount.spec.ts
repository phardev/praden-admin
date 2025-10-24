import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Product } from '@core/entities/product'
import { useIndexStore } from '@store/indexStore'
import { anaca3Minceur, chamomilla, dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { getProductCount } from './getProductCount'

describe('Get product count', () => {
  let productGateway: InMemoryProductGateway
  let indexStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    indexStore = useIndexStore()
  })

  describe('There is no product', () => {
    it('should return 0', async () => {
      await whenGetProductCount()
      expectCountToBe(0)
    })
  })

  describe('There is some products', () => {
    it('should count them', async () => {
      givenExistingProducts(dolodent, anaca3Minceur, chamomilla)
      await whenGetProductCount()
      expectCountToBe(3)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }

  const whenGetProductCount = async () => {
    await getProductCount(productGateway)
  }

  const expectCountToBe = (expected: number) => {
    expect(indexStore.count).toBe(expected)
  }
})
