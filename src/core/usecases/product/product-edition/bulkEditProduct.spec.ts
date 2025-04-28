import { bulkEditProduct, BulkEditProductDependencies } from './bulkEditProduct'
import { useProductStore } from '@store/productStore'
import { EditProductDTO } from './editProduct'
import { UUID } from '@core/types/types'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { Product } from '@core/entities/product'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import { setActivePinia, createPinia } from 'pinia'

describe('bulkEditProduct usecase', () => {
  let productGateway: InMemoryProductGateway
  let productStore: ReturnType<typeof useProductStore>
  let productUuids: Array<UUID>
  let bulkEditDto: EditProductDTO
  let expectedProducts: Array<Product>

  beforeEach(async () => {
    setActivePinia(createPinia())
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    productStore = useProductStore()
    givenExistingProducts([chamomilla, ultraLevure, dolodent])
    givenBulkEditDto({
      flags: { arePromotionsAllowed: false }
    })
    await whenBulkEditProducts([
      chamomilla.uuid,
      ultraLevure.uuid,
      dolodent.uuid
    ])
    expectedProducts = [chamomilla, ultraLevure, dolodent].map((product) => ({
      ...product,
      flags: {
        ...product.flags,
        arePromotionsAllowed: false
      }
    }))
  })

  it('should update all targeted products in the gateway', async () => {
    await expectGatewayProductsToEqual()
  })

  it('should update all targeted products in the store', async () => {
    await expectStoreProductsToMatchGateway()
  })

  const givenExistingProducts = (products: Array<Product>) => {
    productGateway.feedWith(...products)
    productUuids = products.map((product) => product.uuid)
  }

  const givenBulkEditDto = (dto: EditProductDTO) => {
    bulkEditDto = dto
  }

  const whenBulkEditProducts = async (uuids: Array<UUID>) => {
    const dependencies: BulkEditProductDependencies = {
      productGateway
    }
    await bulkEditProduct(dependencies)({
      uuids,
      dto: bulkEditDto
    })
  }

  const expectGatewayProductsToEqual = async () => {
    expect(await productGateway.list(100, 0)).toStrictEqual(expectedProducts)
  }

  const expectStoreProductsToMatchGateway = async () => {
    const expectedProducts = await Promise.all(
      productUuids.map((uuid) => productGateway.getByUuid(uuid))
    )
    expect(productStore.items).toStrictEqual(expectedProducts)
  }
})
