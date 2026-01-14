import { UUID } from '@core/types/types'

export interface ProductStockStats {
  inStockCount: number
  outOfStockCount: number
}

export interface MonthlySales {
  month: string
  count: number
  turnover: number
  canceledTurnover: number
  deliveryPrice: number
  averageBasketValue: number
}

export interface TotalSales {
  count: number
  turnover: number
  canceledTurnover: number
  deliveryPrice: number
  averageBasketValue: number
}

export interface TopProductCategory {
  uuid: UUID
  name: string
}

export interface TopProductLaboratory {
  uuid: UUID
  name: string
}

export interface TopProduct {
  productUuid: string
  name: string
  ean13: string
  count: number
  categories: Array<TopProductCategory>
  laboratory: TopProductLaboratory
}

export interface OrderByDeliveryMethod {
  deliveryMethodUuid: UUID
  deliveryMethodName: string
  count: number
}

export interface OrderByLaboratory {
  laboratoryUuid: UUID
  laboratoryName: string
  count: number
}

export interface ProductByCategory {
  uuid: UUID
  name: string
  count: number
  parentUuid?: UUID | null
}

export interface Dashboard {
  monthlySales: MonthlySales[]
  previousYearMonthlySales: MonthlySales[]
  totalSales: TotalSales
  previousYearTotalSales: TotalSales
  topProducts: TopProduct[]
  ordersByDeliveryMethod: OrderByDeliveryMethod[]
  ordersByLaboratory: OrderByLaboratory[]
  productQuantitiesByCategory: ProductByCategory[]
  productStockStats: ProductStockStats
}
