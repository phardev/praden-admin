import { MonthlySales, TopProduct, TotalSales } from '@core/entities/dashboard'
import { useStatsStore } from '@store/statsStore'

export interface MonthlySalesVM
  extends Omit<
    MonthlySales,
    'turnover' | 'canceledTurnover' | 'deliveryPrice' | 'averageBasketValue'
  > {
  turnover: number
  canceledTurnover: number
  deliveryPrice: number
  averageBasketValue: number
}

export interface TotalSalesVM
  extends Omit<
    TotalSales,
    'turnover' | 'canceledTurnover' | 'deliveryPrice' | 'averageBasketValue'
  > {
  turnover: number
  canceledTurnover: number
  deliveryPrice: number
  averageBasketValue: number
}

export interface DashboardVM {
  monthlySales: MonthlySalesVM[]
  totalSales: TotalSalesVM
  topProducts: TopProduct[]
}

export const getDashboardVM = (): DashboardVM => {
  const statsStore = useStatsStore()
  const dashboard = statsStore.dashboard
  if (!dashboard) {
    return {
      monthlySales: [],
      totalSales: {
        count: 0,
        turnover: 0,
        canceledTurnover: 0,
        deliveryPrice: 0,
        averageBasketValue: 0
      },
      topProducts: []
    }
  }
  return {
    monthlySales: dashboard.monthlySales.map((sale) => ({
      ...sale,
      turnover: sale.turnover / 100,
      canceledTurnover: sale.canceledTurnover / 100,
      deliveryPrice: sale.deliveryPrice / 100,
      averageBasketValue: sale.averageBasketValue / 100
    })),
    totalSales: {
      ...dashboard.totalSales,
      turnover: dashboard.totalSales.turnover / 100,
      canceledTurnover: dashboard.totalSales.canceledTurnover / 100,
      deliveryPrice: dashboard.totalSales.deliveryPrice / 100,
      averageBasketValue: dashboard.totalSales.averageBasketValue / 100
    },
    topProducts: dashboard.topProducts
  }
}
