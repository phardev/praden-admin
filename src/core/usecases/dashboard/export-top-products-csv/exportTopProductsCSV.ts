import type { TopProduct } from '@core/entities/dashboard'
import type { DateProvider } from '@core/gateways/dateProvider'
import type { FileDownloadService } from '@core/gateways/fileDownloadService'

const escapeCSVField = (field: string): string => {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

export const generateCSVContent = (topProducts: TopProduct[]): string => {
  const headers = 'name,ean13,qty sold'
  if (topProducts.length === 0) {
    return headers
  }

  const rows = topProducts.map(
    (product) =>
      `${escapeCSVField(product.name)},${product.ean13},${product.count}`
  )

  return [headers, ...rows].join('\n')
}

export const exportTopProductsCSV = (
  topProducts: TopProduct[],
  fileDownloadService: FileDownloadService,
  dateProvider: DateProvider
): void => {
  const csvContent = generateCSVContent(topProducts)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const date = new Date(dateProvider.now())
  const formattedDate = date.toISOString().split('T')[0]
  const filename = `top-products-${formattedDate}.csv`
  fileDownloadService.downloadFile(blob, filename)
}
