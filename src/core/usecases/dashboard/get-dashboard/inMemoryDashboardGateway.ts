import { Dashboard } from '@core/entities/dashboard'
import {
  DashboardGateway,
  DashboardParams
} from '@core/gateways/dashboardGateway'

export class InMemoryDashboardGateway implements DashboardGateway {
  private mockData: Dashboard
  public receivedTimezone?: string

  constructor() {
    this.mockData = {
      monthlySales: [],
      nextYearMonthlySales: [],
      totalSales: {
        count: 0,
        turnover: 0,
        averageBasketValue: 0,
        canceledTurnover: 0,
        deliveryPrice: 0
      },
      previousYearTotalSales: {
        count: 0,
        turnover: 0,
        averageBasketValue: 0,
        canceledTurnover: 0,
        deliveryPrice: 0
      },
      topProducts: [],
      ordersByDeliveryMethod: [],
      ordersByLaboratory: [],
      productQuantitiesByCategory: [],
      productStockStats: {
        inStockCount: 0,
        outOfStockCount: 0
      }
    }
  }

  async getDashboardData(params: DashboardParams): Promise<Dashboard> {
    this.receivedTimezone = params.timezone
    let filteredTopProducts = this.mockData.topProducts

    if (params.laboratoryUuid) {
      filteredTopProducts = filteredTopProducts.filter(
        (product) => product.laboratory.uuid === params.laboratoryUuid
      )
    }

    if (params.categoryUuid) {
      filteredTopProducts = filteredTopProducts.filter((product) =>
        product.categories.some(
          (category) => category.uuid === params.categoryUuid
        )
      )
    }

    if (params.productLimit) {
      filteredTopProducts = filteredTopProducts.slice(0, params.productLimit)
    }

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
      nextYearMonthlySales: this.mockData.nextYearMonthlySales,
      totalSales: {
        count: totalCount,
        turnover: totalTurnover,
        averageBasketValue,
        canceledTurnover: 0,
        deliveryPrice: 0
      },
      previousYearTotalSales: this.mockData.previousYearTotalSales,
      topProducts: filteredTopProducts,
      ordersByDeliveryMethod: this.mockData.ordersByDeliveryMethod,
      ordersByLaboratory: this.mockData.ordersByLaboratory,
      productQuantitiesByCategory: this.mockData.productQuantitiesByCategory,
      productStockStats: this.mockData.productStockStats
    }
  }

  feedWith(mockData: Dashboard) {
    this.mockData = mockData
  }
}
