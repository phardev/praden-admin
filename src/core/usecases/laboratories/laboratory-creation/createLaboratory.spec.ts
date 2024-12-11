import { InMemoryLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/inMemoryLaboratoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { UUID } from '@core/types/types'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { createPinia, setActivePinia } from 'pinia'
import {
  createLaboratory,
  CreateLaboratoryDTO
} from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { Laboratory } from '../../../entities/laboratory'
import { dolodent, hemoclar } from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { useProductStore } from '@store/productStore'

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
      await expectProductGatewayToContains(expectedProducts)
    })

    it('should save the products in store', () => {
      expect(productStore.items).toStrictEqual(expectedProducts)
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
    productStore.items = JSON.parse(JSON.stringify(products))
  }

  const whenCreateLaboratory = async () => {
    await createLaboratory(dto, laboratoryGateway, productGateway)
  }

  const expectProductGatewayToContains = async (expected: Array<Product>) => {
    expect(await productGateway.list(50, 0)).toStrictEqual(expected)
  }
})
