import { InMemoryLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/inMemoryLaboratoryGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Product } from '@core/entities/product'
import { UUID } from '@core/types/types'
import {
  CreateLaboratoryDTO,
  createLaboratory
} from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useProductStore } from '@store/productStore'
import {
  dolodentListItem,
  hemoclarListItem
} from '@utils/testData/fixtures/products/productListItems'
import { dolodent, hemoclar } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { Laboratory } from '../../../entities/laboratory'

describe('Laboratory creation', () => {
  let laboratoryStore: any
  let productStore: any
  let laboratoryGateway: InMemoryLaboratoryGateway
  let productGateway: InMemoryProductGateway
  let uuidGenerator: FakeUuidGenerator
  let dto: CreateLaboratoryDTO
  let uuid: UUID
  let expectedLaboratory: Laboratory
  let expectedProducts: Array<Product>

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
    productStore = useProductStore()
    uuidGenerator = new FakeUuidGenerator()
    laboratoryGateway = new InMemoryLaboratoryGateway(uuidGenerator)
    productGateway = new InMemoryProductGateway(uuidGenerator)
  })

  describe('Create simple laboratory', () => {
    beforeEach(async () => {
      givenNextUuidIs('new-uuid')
      dto = {
        name: 'test',
        description: 'description de test',
        productsAdded: []
      }
      expectedLaboratory = {
        uuid,
        name: dto.name,
        description: dto.description
      }
      await whenCreateLaboratory()
    })
    it('should save the laboratory', async () => {
      expect(await laboratoryGateway.list()).toStrictEqual([expectedLaboratory])
    })

    it('should save the laboratory in store', () => {
      expect(laboratoryStore.items).toStrictEqual([expectedLaboratory])
    })
  })
  describe('Create laboratory with images', () => {
    beforeEach(async () => {
      givenNextUuidIs('another-uuid')
      dto = {
        name: 'another-test',
        description: 'another description de test',
        productsAdded: [],
        image: new File(['image'], 'Image', { type: 'image/png' }),
        miniature: new File(['miniature'], 'Miniature', { type: 'image/png' })
      }
      expectedLaboratory = {
        uuid,
        name: dto.name,
        description: dto.description,
        image: 'data:image/png;base64,aW1hZ2U=',
        miniature: 'data:image/png;base64,bWluaWF0dXJl'
      }
      await whenCreateLaboratory()
    })
    it('should save the laboratory', async () => {
      expect(await laboratoryGateway.list()).toStrictEqual([expectedLaboratory])
    })

    it('should save the laboratory in store', () => {
      expect(laboratoryStore.items).toStrictEqual([expectedLaboratory])
    })
  })
  describe('Create laboratory with some products', () => {
    beforeEach(async () => {
      givenExistingProducts(dolodent, hemoclar)
      givenNextUuidIs('new-uuid')
      dto = {
        name: 'test',
        description: 'description de test',
        productsAdded: [dolodent.uuid, hemoclar.uuid]
      }
      expectedLaboratory = {
        uuid,
        name: dto.name,
        description: dto.description
      }
      expectedProducts = [
        {
          ...dolodent,
          laboratory: expectedLaboratory
        },
        {
          ...hemoclar,
          laboratory: expectedLaboratory
        }
      ]
      await whenCreateLaboratory()
    })
    it('should update the products', async () => {
      const expectedListItems = expectedProducts.map((product) => ({
        uuid: product.uuid,
        name: product.name,
        ean13: product.ean13,
        laboratory: product.laboratory
          ? {
              uuid: product.laboratory.uuid,
              name: product.laboratory.name
            }
          : undefined,
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
      }))
      await expectProductGatewayToContains(expectedListItems)
    })

    it('should save the products in store', () => {
      const expectedListItems = expectedProducts.map((product) => ({
        uuid: product.uuid,
        name: product.name,
        ean13: product.ean13,
        laboratory: product.laboratory
          ? {
              uuid: product.laboratory.uuid,
              name: product.laboratory.name
            }
          : undefined,
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
      }))
      expect(productStore.items).toStrictEqual(expectedListItems)
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      givenExistingProducts(dolodent, hemoclar)
      givenNextUuidIs('new-uuid')
      dto = {
        name: 'test',
        description: 'description de test',
        productsAdded: [dolodent.uuid, hemoclar.uuid]
      }
    })
    it('should be aware during loading', async () => {
      const unsubscribe = laboratoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenCreateLaboratory()
    })
    it('should be aware that loading is over', async () => {
      await whenCreateLaboratory()
      expect(laboratoryStore.isLoading).toBe(false)
    })
  })

  const givenNextUuidIs = (nextUuid: UUID) => {
    uuid = nextUuid
    uuidGenerator.setNext(uuid)
  }

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...JSON.parse(JSON.stringify(products)))
    const productToListItemMap: Record<string, ProductListItem> = {
      [dolodent.uuid]: dolodentListItem,
      [hemoclar.uuid]: hemoclarListItem
    }
    productStore.items = products.map((p) => productToListItemMap[p.uuid])
  }

  const whenCreateLaboratory = async () => {
    await createLaboratory(dto, laboratoryGateway, productGateway)
  }

  const expectProductGatewayToContains = async (
    expected: Array<ProductListItem>
  ) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
