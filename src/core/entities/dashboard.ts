import { UUID } from '@core/types/types'

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
  count: number
  categories: Array<TopProductCategory>
  laboratory: TopProductLaboratory
}

export interface Dashboard {
  monthlySales: MonthlySales[]
  totalSales: TotalSales
  topProducts: TopProduct[]
}
