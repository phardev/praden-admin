import type { TopProduct } from '@core/entities/dashboard'
import type { DateProvider } from '@core/gateways/dateProvider'
import type { FileDownloadService } from '@core/gateways/fileDownloadService'

export interface ExportTopProductsLabels {
  filenamePrefix: string
  productName: string
  ean13: string
  orderCount: string
}

const escapeCSVField = (field: string): string => {
  if (field.includes(';') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

export const generateCSVContent = (
  topProducts: TopProduct[],
  labels: Pick<ExportTopProductsLabels, 'productName' | 'ean13' | 'orderCount'>
): string => {
  const headers = `${labels.productName};${labels.ean13};${labels.orderCount}`
  if (topProducts.length === 0) {
    return headers
  }

  const rows = topProducts.map(
    (product) =>
      `${escapeCSVField(product.name)};${product.ean13};${product.count}`
  )

  return [headers, ...rows].join('\n')
}

export const exportTopProductsCSV = (
  topProducts: TopProduct[],
  fileDownloadService: FileDownloadService,
  dateProvider: DateProvider,
  labels: ExportTopProductsLabels
): void => {
  const csvContent = generateCSVContent(topProducts, labels)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const date = new Date(dateProvider.now())
  const formattedDate = date.toISOString().split('T')[0]
  const filename = `${labels.filenamePrefix}-${formattedDate}.csv`
  fileDownloadService.downloadFile(blob, filename)
}
