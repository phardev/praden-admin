import type {
  Ean13ResolutionScope,
  ProductGateway
} from '@core/gateways/productGateway'
import type { UUID } from '@core/types/types'
import { useProductStore } from '@store/productStore'
import { readFileAsText } from '@utils/file'
import { parseEan13CSV } from './parseEan13CSV'

export interface ImportResult {
  addedCount: number
  ineligibleCount: number
  notFoundCodes: Array<string>
}

export const importProductsFromCSV = async (
  file: File,
  scope: Ean13ResolutionScope,
  productGateway: ProductGateway,
  addProducts: (uuids: Array<UUID>) => void
): Promise<ImportResult> => {
  const productStore = useProductStore()

  const csvContent = await readFileAsText(file)
  const ean13s = parseEan13CSV(csvContent)

  if (ean13s.length === 0) {
    return { addedCount: 0, ineligibleCount: 0, notFoundCodes: [] }
  }

  const result = await productGateway.resolveByEan13s(ean13s, scope)

  productStore.list(result.eligible)
  addProducts(result.eligible.map((p) => p.uuid))

  return {
    addedCount: result.eligible.length,
    ineligibleCount: result.ineligibleCount,
    notFoundCodes: result.notFound
  }
}
