import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Product, ProductWithPromotion } from '@core/entities/product'
import { Promotion } from '@core/entities/promotion'
import { ProductDoesNotExistsError } from '@core/errors/ProductDoesNotExistsError'
import { UUID } from '@core/types/types'
import { getProduct } from '@core/usecases/product/get-product/getProduct'
import { useProductStore } from '@store/productStore'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe } from 'vitest'

describe('Get product', () => {
  let productStore: any
  let productGateway: InMemoryProductGateway
  let promotionGateway: InMemoryPromotionGateway
  const dateProvider: FakeDateProvider = new FakeDateProvider()

  beforeEach(() => {
    setActivePinia(createPinia())
    productStore = useProductStore()
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    promotionGateway = new InMemoryPromotionGateway(new FakeUuidGenerator())
  })

  describe('The product exists', () => {
    const product = dolodent
    beforeEach(() => {
      givenExistingProducts(chamomilla, dolodent)
    })
    describe('There is no promotion', () => {
      beforeEach(async () => {
        await whenGetProduct(product.uuid)
      })
      it('should store the product without the promotion in product store', () => {
        expectCurrentProductToBe({ product })
      })
    })
    describe('There is some promotions', () => {
      beforeEach(() => {
        givenExistingPromotions(
          promotionPercentageDolodent,
          promotionFixedMultipleProducts
        )
      })
      describe('There is active promotion for the product', () => {
        beforeEach(async () => {
          givenNowIs(1690417000000)
          await whenGetProduct(product.uuid)
        })
        it('should store the promotion in the product store', () => {
          expectCurrentProductToBe({
            product,
            promotion: promotionPercentageDolodent
          })
        })
      })
      describe('There is not active promotion for the product', () => {
        beforeEach(async () => {
          givenNowIs(100000000000)
          await whenGetProduct(product.uuid)
        })
        it('should store only the product in the product store', () => {
          expectCurrentProductToBe({
            product
          })
        })
      })
    })
  })

  describe('The product does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetProduct('NotExists')).rejects.toThrow(
        ProductDoesNotExistsError
      )
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
      await whenGetProduct(dolodent.uuid)
    })
    it('should be aware that loading is over', async () => {
      await whenGetProduct(dolodent.uuid)
      expect(productStore.isLoading).toBe(false)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }
  const givenExistingPromotions = (...promotions: Array<Promotion>) => {
    promotionGateway.feedWith(...promotions)
  }
  const givenNowIs = (now: number) => {
    dateProvider.feedWith(now)
  }
  const whenGetProduct = async (uuid: UUID): Promise<void> => {
    await getProduct(uuid, productGateway, promotionGateway, dateProvider)
  }
  const expectCurrentProductToBe = (product: ProductWithPromotion) => {
    expect(productStore.current).toStrictEqual(product)
  }
})
