import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryFileDownloadService } from '@adapters/secondary/file-download-services/InMemoryFileDownloadService'
import {
  type AbandonedProduct,
  emptyCartStatistics,
  emptyDashboard
} from '@core/entities/dashboard'
import {
  type ExportTopAbandonedProductsLabels,
  exportTopAbandonedProductsCSV
} from '@core/usecases/dashboard/export-top-abandoned-products-csv/exportTopAbandonedProductsCSV'
import { useStatsStore } from '@store/statsStore'
import { createPinia, setActivePinia } from 'pinia'

const labels: ExportTopAbandonedProductsLabels = {
  filenamePrefix: 'produits-plus-abandonnes',
  productName: 'Produit',
  ean13: 'EAN13',
  unitPriceWithTax: 'Prix unitaire TTC',
  cartCount: 'Paniers'
}

const doliprane: AbandonedProduct = {
  productUuid: 'product-1',
  name: 'Doliprane 1000mg',
  ean13: '3400930000001',
  priceWithTax: 290,
  count: 12
}

const efferalgan: AbandonedProduct = {
  productUuid: 'product-2',
  name: 'Efferalgan; "Vitamine C"',
  ean13: '3400930000002',
  priceWithTax: 123450,
  count: 7
}

describe('Export top abandoned products CSV', () => {
  let fileDownloadService: InMemoryFileDownloadService
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    fileDownloadService = new InMemoryFileDownloadService()
    dateProvider = new FakeDateProvider()
  })

  describe('The dashboard shows abandoned products', () => {
    beforeEach(() => {
      givenTopAbandonedProducts([doliprane, efferalgan])
    })

    it('should export the displayed products in order with French prices', async () => {
      whenExportTopAbandonedProductsCSV()
      expect(await downloadedContent()).toStrictEqual(
        [
          'Produit;EAN13;Prix unitaire TTC;Paniers',
          'Doliprane 1000mg;3400930000001;2,90;12',
          '"Efferalgan; ""Vitamine C""";3400930000002;1234,50;7'
        ].join('\n')
      )
    })

    it('should create a CSV blob', () => {
      whenExportTopAbandonedProductsCSV()
      expect(
        fileDownloadService.getLastDownloadedFile()?.blob.type
      ).toStrictEqual('text/csv;charset=utf-8')
    })

    it('should name the file with the prefix and the current date', () => {
      dateProvider.feedWith(1609459200000)
      whenExportTopAbandonedProductsCSV()
      expect(
        fileDownloadService.getLastDownloadedFile()?.filename
      ).toStrictEqual('produits-plus-abandonnes-2021-01-01.csv')
    })
  })

  describe('The dashboard shows no abandoned product', () => {
    it('should export the headers only', async () => {
      givenTopAbandonedProducts([])
      whenExportTopAbandonedProductsCSV()
      expect(await downloadedContent()).toStrictEqual(
        'Produit;EAN13;Prix unitaire TTC;Paniers'
      )
    })
  })

  describe('The dashboard is not loaded', () => {
    it('should export the headers only', async () => {
      whenExportTopAbandonedProductsCSV()
      expect(await downloadedContent()).toStrictEqual(
        'Produit;EAN13;Prix unitaire TTC;Paniers'
      )
    })
  })

  const givenTopAbandonedProducts = (
    topAbandonedProducts: AbandonedProduct[]
  ): void => {
    useStatsStore().setDashboard({
      ...emptyDashboard(),
      cartStatistics: { ...emptyCartStatistics(), topAbandonedProducts }
    })
  }

  const whenExportTopAbandonedProductsCSV = (): void => {
    exportTopAbandonedProductsCSV(fileDownloadService, dateProvider, labels)
  }

  const downloadedContent = (): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsText(fileDownloadService.getLastDownloadedFile()!.blob)
    })
})
