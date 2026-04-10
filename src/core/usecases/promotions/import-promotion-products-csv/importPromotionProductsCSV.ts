import type { ProductGateway } from '@core/gateways/productGateway'
import { useProductStore } from '@store/productStore'
import { readFileAsText } from '@utils/file'
import { parsePromotionCSV } from './parsePromotionCSV'

export interface ImportResult {
  addedCount: number
  ineligibleCount: number
  notFoundCodes: Array<string>
}

export const importPromotionProductsCSV = async (
  file: File,
  productGateway: ProductGateway,
  addProducts: (uuids: Array<string>) => void
): Promise<ImportResult> => {
  const productStore = useProductStore()

  const csvContent = await readFileAsText(file)
  const ean13s = parsePromotionCSV(csvContent)

  if (ean13s.length === 0) {
    return { addedCount: 0, ineligibleCount: 0, notFoundCodes: [] }
  }

  const result = await productGateway.resolveByEan13s(ean13s)

  productStore.list(result.eligible)
  addProducts(result.eligible.map((p) => p.uuid))

  return {
    addedCount: result.eligible.length,
    ineligibleCount: result.ineligibleCount,
    notFoundCodes: result.notFound
  }
}
