import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  ImportResult,
  importPromotionProductsCSV
} from '@core/usecases/promotions/import-promotion-products-csv/importPromotionProductsCSV'
import { useProductStore } from '@store/productStore'
import {
  anaca3Minceur,
  calmosine,
  dolodent,
  productWithForbiddenPromotion
} from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Import promotion products CSV', () => {
  let productGateway: InMemoryProductGateway
  let productStore: ReturnType<typeof useProductStore>
  let result: ImportResult
  let addedUuids: Array<string>

  beforeEach(() => {
    setActivePinia(createPinia())
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    productStore = useProductStore()
    addedUuids = []
  })

  const addProducts = (uuids: Array<string>) => {
    addedUuids = uuids
  }

  describe('CSV with eligible products', () => {
    beforeEach(async () => {
      productGateway.feedWith(anaca3Minceur, calmosine)
      await whenImporting(
        `Code13;Name\n${anaca3Minceur.ean13};Anaca3\n${calmosine.ean13};Calmosine`
      )
    })

    it('should add eligible products to product store', () => {
      expect(productStore.getByUuid(anaca3Minceur.uuid)).toBeDefined()
    })

    it('should return correct added count', () => {
      expect(result.addedCount).toStrictEqual(2)
    })

    it('should call addProducts with eligible uuids', () => {
      expect(addedUuids).toStrictEqual([anaca3Minceur.uuid, calmosine.uuid])
    })
  })

  describe('CSV with medicine products', () => {
    beforeEach(async () => {
      productGateway.feedWith(dolodent, anaca3Minceur)
      await whenImporting(`Code13\n${dolodent.ean13}\n${anaca3Minceur.ean13}`)
    })

    it('should return ineligible count', () => {
      expect(result.ineligibleCount).toStrictEqual(1)
    })
  })

  describe('CSV with products that have promotions forbidden', () => {
    beforeEach(async () => {
      productGateway.feedWith(productWithForbiddenPromotion, anaca3Minceur)
      await whenImporting(
        `Code13\n${productWithForbiddenPromotion.ean13}\n${anaca3Minceur.ean13}`
      )
    })

    it('should return ineligible count', () => {
      expect(result.ineligibleCount).toStrictEqual(1)
    })
  })

  describe('CSV with unknown EAN13 codes', () => {
    beforeEach(async () => {
      productGateway.feedWith(anaca3Minceur)
      await whenImporting(`Code13\n${anaca3Minceur.ean13}\n9999999999999`)
    })

    it('should return not found codes', () => {
      expect(result.notFoundCodes).toStrictEqual(['9999999999999'])
    })
  })

  describe('Empty CSV (header only)', () => {
    beforeEach(async () => {
      productGateway.feedWith(anaca3Minceur)
      await whenImporting('Code13')
    })

    it('should return empty result', () => {
      expect(result).toStrictEqual({
        addedCount: 0,
        ineligibleCount: 0,
        notFoundCodes: []
      })
    })

    it('should not call addProducts', () => {
      expect(addedUuids).toStrictEqual([])
    })
  })

  const whenImporting = async (csvContent: string) => {
    const file = new File([csvContent], 'products.csv', { type: 'text/csv' })
    result = await importPromotionProductsCSV(file, productGateway, addProducts)
  }
})
