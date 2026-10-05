import type { AbandonedProduct } from '@core/entities/dashboard'
import type { DateProvider } from '@core/gateways/dateProvider'
import type { FileDownloadService } from '@core/gateways/fileDownloadService'
import { useStatsStore } from '@store/statsStore'
import { escapeCSVField } from '@utils/csv'

export interface ExportTopAbandonedProductsLabels {
  filenamePrefix: string
  productName: string
  ean13: string
  unitPriceWithTax: string
  cartCount: string
}

const frenchPriceOf = (cents: number): string =>
  (cents / 100).toFixed(2).replace('.', ',')

const rowOf = (product: AbandonedProduct): string =>
  [
    escapeCSVField(product.name),
    product.ean13,
    frenchPriceOf(product.priceWithTax),
    product.count
  ].join(';')

const csvContentOf = (
  products: AbandonedProduct[],
  labels: ExportTopAbandonedProductsLabels
): string => {
  const headers = [
    labels.productName,
    labels.ean13,
    labels.unitPriceWithTax,
    labels.cartCount
  ].join(';')
  return [headers, ...products.map(rowOf)].join('\n')
}

export const exportTopAbandonedProductsCSV = (
  fileDownloadService: FileDownloadService,
  dateProvider: DateProvider,
  labels: ExportTopAbandonedProductsLabels
): void => {
  const products =
    useStatsStore().dashboard?.cartStatistics.topAbandonedProducts ?? []
  const blob = new Blob([csvContentOf(products, labels)], {
    type: 'text/csv;charset=utf-8'
  })
  const formattedDate = new Date(dateProvider.now()).toISOString().split('T')[0]
  fileDownloadService.downloadFile(
    blob,
    `${labels.filenamePrefix}-${formattedDate}.csv`
  )
}
