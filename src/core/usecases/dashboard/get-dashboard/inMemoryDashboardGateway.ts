import {
  DashboardGateway,
  DashboardParams
} from '@core/gateways/dashboardGateway'
import { Dashboard } from '@core/entities/dashboard'

export class InMemoryDashboardGateway implements DashboardGateway {
  private mockData: Dashboard

  async getDashboardData(params: DashboardParams): Promise<Dashboard> {
    const filteredTopProducts = params.productLimit
      ? this.mockData.topProducts.slice(0, params.productLimit)
      : this.mockData.topProducts

    let filteredMonthlySales = [...this.mockData.monthlySales]

    if (params.startDate || params.endDate) {
      filteredMonthlySales = this.mockData.monthlySales.filter((sale) => {
        const saleDate = new Date(sale.month + '-01')
        const isAfterStart = params.startDate
          ? saleDate >= params.startDate
          : true
        const isBeforeEnd = params.endDate ? saleDate <= params.endDate : true
        return isAfterStart && isBeforeEnd
      })
    }

    const totalCount = filteredMonthlySales.reduce(
      (sum, sale) => sum + sale.count,
      0
    )
    const totalTurnover = filteredMonthlySales.reduce(
      (sum, sale) => sum + sale.turnover,
      0
    )
    const averageBasketValue = totalCount > 0 ? totalTurnover / totalCount : 0

    return {
      monthlySales: filteredMonthlySales,
      totalSales: {
        count: totalCount,
        turnover: totalTurnover,
        averageBasketValue
      },
      topProducts: filteredTopProducts
    }
  }

  feedWith(mockData: Dashboard) {
    this.mockData = mockData
  }
}
