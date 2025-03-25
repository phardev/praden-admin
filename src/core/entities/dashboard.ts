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

export interface TopProduct {
  productUuid: string
  name: string
  count: number
}

export interface Dashboard {
  monthlySales: MonthlySales[]
  totalSales: TotalSales
  topProducts: TopProduct[]
}
