import { MonthlySales, TopProduct, TotalSales } from '@core/entities/dashboard'
import { useStatsStore } from '@store/statsStore'

export interface MonthlySalesVM
  extends Omit<MonthlySales, 'turnover' | 'averageBasketValue'> {
  turnover: number
  averageBasketValue: number
}

export interface TotalSalesVM
  extends Omit<TotalSales, 'turnover' | 'averageBasketValue'> {
  turnover: number
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
        averageBasketValue: 0
      },
      topProducts: []
    }
  }
  return {
    monthlySales: dashboard.monthlySales.map((sale) => ({
      ...sale,
      turnover: sale.turnover / 100,
      averageBasketValue: sale.averageBasketValue / 100
    })),
    totalSales: {
      ...dashboard.totalSales,
      turnover: dashboard.totalSales.turnover / 100,
      averageBasketValue: dashboard.totalSales.averageBasketValue / 100
    },
    topProducts: dashboard.topProducts
  }
}
