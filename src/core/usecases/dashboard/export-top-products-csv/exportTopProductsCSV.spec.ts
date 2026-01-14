import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryFileDownloadService } from '@adapters/secondary/file-download-services/InMemoryFileDownloadService'
import type { TopProduct } from '@core/entities/dashboard'
import type { ExportTopProductsLabels } from '@core/usecases/dashboard/export-top-products-csv/exportTopProductsCSV'
import {
  exportTopProductsCSV,
  generateCSVContent
} from '@core/usecases/dashboard/export-top-products-csv/exportTopProductsCSV'

const labels: ExportTopProductsLabels = {
  filenamePrefix: 'produits-plus-vendus',
  productName: 'Nom du produit',
  ean13: 'EAN13',
  orderCount: 'Nombre de boites vendues'
}

describe('Export top products CSV', () => {
  let fileDownloadService: InMemoryFileDownloadService
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    fileDownloadService = new InMemoryFileDownloadService()
    dateProvider = new FakeDateProvider()
  })

  describe('The dashboard has top products', () => {
    const topProducts: TopProduct[] = [
      {
        productUuid: 'product-1',
        name: 'Doliprane 1000mg',
        ean13: '3400930000001',
        count: 150,
        categories: [{ uuid: 'cat-1', name: 'Antidouleurs' }],
        laboratory: { uuid: 'lab-1', name: 'Sanofi' }
      },
      {
        productUuid: 'product-2',
        name: 'Efferalgan 500mg',
        ean13: '3400930000002',
        count: 120,
        categories: [{ uuid: 'cat-2', name: 'Fièvre' }],
        laboratory: { uuid: 'lab-2', name: 'UPSA' }
      }
    ]

    it('should create CSV blob with correct content type', () => {
      whenExportTopProductsCSV(topProducts)
      const downloadedFile = fileDownloadService.getLastDownloadedFile()
      expect(downloadedFile?.blob.type).toStrictEqual('text/csv;charset=utf-8')
    })

    it('should generate filename with correct format', () => {
      dateProvider.feedWith(1609459200000)
      whenExportTopProductsCSV(topProducts)
      const downloadedFile = fileDownloadService.getLastDownloadedFile()
      expect(downloadedFile?.filename).toStrictEqual(
        'produits-plus-vendus-2021-01-01.csv'
      )
    })
  })

  describe('CSV content generation', () => {
    it('should generate CSV with correct headers', () => {
      const topProducts: TopProduct[] = [
        {
          productUuid: 'product-1',
          name: 'Doliprane 1000mg',
          ean13: '3400930000001',
          count: 150,
          categories: [],
          laboratory: { uuid: 'lab-1', name: 'Sanofi' }
        }
      ]
      const csvContent = generateCSVContent(topProducts, labels)
      const firstLine = csvContent.split('\n')[0]
      expect(firstLine).toStrictEqual(
        'Nom du produit,EAN13,Nombre de boites vendues'
      )
    })

    it('should include all top products data in CSV rows', () => {
      const topProducts: TopProduct[] = [
        {
          productUuid: 'product-1',
          name: 'Doliprane 1000mg',
          ean13: '3400930000001',
          count: 150,
          categories: [],
          laboratory: { uuid: 'lab-1', name: 'Sanofi' }
        }
      ]
      const csvContent = generateCSVContent(topProducts, labels)
      const lines = csvContent.split('\n')
      expect(lines[1]).toStrictEqual('Doliprane 1000mg,3400930000001,150')
    })

    it('should handle products with commas in names', () => {
      const topProducts: TopProduct[] = [
        {
          productUuid: 'product-1',
          name: 'Doliprane, 1000mg Tablets',
          ean13: '3400930000001',
          count: 150,
          categories: [],
          laboratory: { uuid: 'lab-1', name: 'Sanofi' }
        }
      ]
      const csvContent = generateCSVContent(topProducts, labels)
      const lines = csvContent.split('\n')
      expect(lines[1]).toStrictEqual(
        '"Doliprane, 1000mg Tablets",3400930000001,150'
      )
    })

    it('should handle products with double quotes in names', () => {
      const topProducts: TopProduct[] = [
        {
          productUuid: 'product-1',
          name: 'Doliprane "Extra" 1000mg',
          ean13: '3400930000001',
          count: 150,
          categories: [],
          laboratory: { uuid: 'lab-1', name: 'Sanofi' }
        }
      ]
      const csvContent = generateCSVContent(topProducts, labels)
      const lines = csvContent.split('\n')
      expect(lines[1]).toStrictEqual(
        '"Doliprane ""Extra"" 1000mg",3400930000001,150'
      )
    })

    it('should handle empty top products array', () => {
      const csvContent = generateCSVContent([], labels)
      expect(csvContent).toStrictEqual(
        'Nom du produit,EAN13,Nombre de boites vendues'
      )
    })
  })

  const whenExportTopProductsCSV = (topProducts: TopProduct[]): void => {
    exportTopProductsCSV(topProducts, fileDownloadService, dateProvider, labels)
  }
})
