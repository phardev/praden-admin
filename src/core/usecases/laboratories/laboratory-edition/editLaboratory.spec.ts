import { InMemoryLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/inMemoryLaboratoryGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Laboratory } from '@core/entities/laboratory'
import { Product } from '@core/entities/product'
import { UUID } from '@core/types/types'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useProductStore } from '@store/productStore'
import {
  dolodentListItem,
  hemoclarListItem
} from '@utils/testData/fixtures/products/productListItems'
import { avene, gilbert, sanofiAventis } from '@utils/testData/laboratories'
import { dolodent, hemoclar } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { EditLaboratoryDTO, editLaboratory } from './editLaboratory'

describe('Laboratory edition', () => {
  let laboratoryStore: any
  let productStore: any
  let laboratoryGateway: InMemoryLaboratoryGateway
  let productGateway: InMemoryProductGateway
  let dto: EditLaboratoryDTO
  let expectedLaboratory: Laboratory
  let expectedProducts: Array<Product>

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
    productStore = useProductStore()
    laboratoryGateway = new InMemoryLaboratoryGateway(new FakeUuidGenerator())
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
  })

  describe('The laboratory exists', () => {
    beforeEach(() => {
      givenExistingLaboratories(avene, gilbert)
    })
    describe('Simple edit', () => {
      beforeEach(async () => {
        dto = {
          name: 'New name'
        }
        expectedLaboratory = {
          ...avene,
          name: dto.name!
        }
        await whenEditLaboratory(avene.uuid)
      })
      it('should update the laboratory in gateway', async () => {
        expect(await laboratoryGateway.list()).toStrictEqual([
          expectedLaboratory,
          gilbert
        ])
      })
      it('should update the laboratory in store', () => {
        expect(laboratoryStore.items).toStrictEqual([
          expectedLaboratory,
          gilbert
        ])
      })
    })
    describe('Edit image and miniature', () => {
      beforeEach(async () => {
        dto = {
          newImage: new File(['image'], 'Image', { type: 'image/png' }),
          newMiniature: new File(['miniature'], 'Miniature', {
            type: 'image/png'
          })
        }
        expectedLaboratory = {
          ...avene,
          image: 'data:image/png;base64,aW1hZ2U=',
          miniature: 'data:image/png;base64,bWluaWF0dXJl'
        }
        await whenEditLaboratory(avene.uuid)
      })
      it('should update the laboratory in gateway', async () => {
        expect(await laboratoryGateway.list()).toStrictEqual([
          expectedLaboratory,
          gilbert
        ])
      })
      it('should update the laboratory in store', () => {
        expect(laboratoryStore.items).toStrictEqual([
          expectedLaboratory,
          gilbert
        ])
      })
    })
    describe('Add some products', () => {
      beforeEach(async () => {
        givenExistingProducts(dolodent, hemoclar)
        dto = {
          productsAdded: [dolodent.uuid, hemoclar.uuid]
        }
        expectedLaboratory = avene
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
        await whenEditLaboratory(avene.uuid)
      })
      it('should update the products in gateway', async () => {
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
          minStockToSell: product.minStockToSell,
          stockManagementMode: product.stockManagementMode,
          status: product.status,
          flags: product.flags,
          miniature: product.miniature,
          isMedicine: product.isMedicine
        }))
        await expectProductGatewayToContains(expectedListItems)
      })
      it('should update the products in store', () => {
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
          minStockToSell: product.minStockToSell,
          stockManagementMode: product.stockManagementMode,
          status: product.status,
          flags: product.flags,
          miniature: product.miniature,
          isMedicine: product.isMedicine
        }))
        expect(productStore.items).toStrictEqual(expectedListItems)
      })
    })
    describe('Remove some products', () => {
      beforeEach(async () => {
        givenExistingProducts(dolodent, hemoclar)
        dto = {
          productsRemoved: [dolodent.uuid]
        }
        expectedLaboratory = gilbert
        const expectedDolodent = JSON.parse(JSON.stringify(dolodent))
        expectedDolodent.laboratory = undefined
        expectedProducts = [expectedDolodent, hemoclar]
        await whenEditLaboratory(gilbert.uuid)
      })
      it('should update the products in gateway', async () => {
        const expectedListItems = expectedProducts.map((product) => {
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
            minStockToSell: product.minStockToSell,
            stockManagementMode: product.stockManagementMode,
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
        })
        await expectProductGatewayToContains(expectedListItems)
      })
      it('should update the products in store', () => {
        const expectedListItems = expectedProducts.map((product) => {
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
            minStockToSell: product.minStockToSell,
            stockManagementMode: product.stockManagementMode,
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
        })
        expect(productStore.items).toStrictEqual(expectedListItems)
      })
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      givenExistingLaboratories(sanofiAventis)
      givenExistingProducts(dolodent)
      dto = {
        productsRemoved: [dolodent.uuid]
      }
    })
    it('should be aware during loading', async () => {
      const unsubscribe = laboratoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenEditLaboratory(sanofiAventis.uuid)
    })
    it('should be aware that loading is over', async () => {
      await whenEditLaboratory(sanofiAventis.uuid)
      expect(laboratoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...JSON.parse(JSON.stringify(products)))
    const productToListItemMap: Record<string, ProductListItem> = {
      [dolodent.uuid]: dolodentListItem,
      [hemoclar.uuid]: hemoclarListItem
    }
    productStore.items = products.map((p) => productToListItemMap[p.uuid])
  }

  const givenExistingLaboratories = (...laboratories: Array<Laboratory>) => {
    laboratoryGateway.feedWith(...JSON.parse(JSON.stringify(laboratories)))
    laboratoryStore.items = JSON.parse(JSON.stringify(laboratories))
  }

  const whenEditLaboratory = async (uuid: UUID) => {
    await editLaboratory(uuid, dto, laboratoryGateway, productGateway)
  }

  const expectProductGatewayToContains = async (
    expected: Array<ProductListItem>
  ) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
