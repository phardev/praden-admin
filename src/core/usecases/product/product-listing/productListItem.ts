import { ProductStatus, StockManagementMode } from '@core/entities/product'
import type { UUID } from '@core/types/types'

export interface ProductListItemLaboratory {
  uuid: UUID
  name: string
}

export interface ProductListItemCategory {
  uuid: UUID
  name: string
}

export interface ProductListItem {
  uuid: UUID
  name: string
  ean13: string
  laboratory?: ProductListItemLaboratory
  categories: Array<ProductListItemCategory>
  priceWithoutTax: number
  percentTaxRate: number
  availableStock: number
  minStockToSell: number
  stockManagementMode: StockManagementMode
  status: ProductStatus
  flags: Record<string, boolean>
  miniature: string
  isMedicine: boolean
}
