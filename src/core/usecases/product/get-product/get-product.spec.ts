import { createPinia, setActivePinia } from 'pinia'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { useProductStore } from '@store/productStore'
import { chamomilla, dolodent } from '@utils/testData/products'
import { Product, ProductWithPromotion } from '@core/entities/product'
import { UUID } from '@core/types/types'
import { getProduct } from '@core/usecases/product/get-product/get-product'
import { ProductDoesNotExistsError } from '@core/errors/ProductDoesNotExistsError'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { Promotion } from '@core/entities/promotion'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'

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
