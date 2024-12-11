import { InMemoryLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/inMemoryLaboratoryGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { createPinia, setActivePinia } from 'pinia'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { avene, sanofiAventis } from '@utils/testData/laboratories'
import { Product } from '@core/entities/product'
import { UUID } from '@core/types/types'
import { getLaboratory } from './getLaboratory'
import {
  dolodent,
  hemoclar,
  productWithoutLaboratory,
  productWithoutLocation
} from '@utils/testData/products'
import { LaboratoryDoesNotExistsError } from '@core/errors/LaboratoryDoesNotExistsError'

describe('Get laboratory', () => {
  let laboratoryStore: any
  let laboratoryGateway: InMemoryLaboratoryGateway
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
    laboratoryGateway = new InMemoryLaboratoryGateway(new FakeUuidGenerator())
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
  })

  describe('The laboratory exists and there is not products inside', () => {
    beforeEach(async () => {
      laboratoryGateway.feedWith(avene)
      await whenGetLaboratory(avene.uuid)
    })
    it('should store it in laboratory store', () => {
      expect(laboratoryStore.current).toStrictEqual({
        laboratory: avene,
        products: []
      })
    })
  })

  describe('The laboratory exists and there is some products', () => {
    beforeEach(async () => {
      givenExistingProducts(
        dolodent,
        hemoclar,
        productWithoutLocation,
        productWithoutLaboratory
      )
      laboratoryGateway.feedWith(sanofiAventis)
      await whenGetLaboratory(sanofiAventis.uuid)
    })
    it('should store it in category store', () => {
      expect(laboratoryStore.current).toStrictEqual({
        laboratory: sanofiAventis,
        products: [hemoclar, productWithoutLocation]
      })
    })
  })

  describe('The laboratory does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetLaboratory('not-exists')).rejects.toThrow(
        LaboratoryDoesNotExistsError
      )
    })
  })
  describe('Loading', () => {
    beforeEach(() => {
      laboratoryGateway.feedWith(sanofiAventis)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = laboratoryStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenGetLaboratory(sanofiAventis.uuid)
    })
    it('should be aware that loading is over', async () => {
      await whenGetLaboratory(sanofiAventis.uuid)
      expect(laboratoryStore.isLoading).toBe(false)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productGateway.feedWith(...products)
  }

  const whenGetLaboratory = async (uuid: UUID) => {
    await getLaboratory(uuid, laboratoryGateway, productGateway)
  }
})
