import {
  MonthlySales,
  OrderByDeliveryMethod,
  OrderByLaboratory,
  ProductByCategory,
  ProductStockStats,
  TopProduct,
  TotalSales
} from '@core/entities/dashboard'
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
  previousYearMonthlySales: MonthlySalesVM[]
  totalSales: TotalSalesVM
  topProducts: TopProduct[]
  ordersByDeliveryMethod: OrderByDeliveryMethod[]
  ordersByLaboratory: OrderByLaboratory[]
  productQuantitiesByCategory: ProductByCategory[]
  productStockStats: ProductStockStats
}

export const getDashboardVM = (): DashboardVM => {
  const statsStore = useStatsStore()
  const dashboard = statsStore.dashboard
  if (!dashboard) {
    return {
      monthlySales: [],
      previousYearMonthlySales: [],
      totalSales: {
        count: 0,
        turnover: 0,
        canceledTurnover: 0,
        deliveryPrice: 0,
        averageBasketValue: 0
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
  const mapMonthlySales = (sale: MonthlySales): MonthlySalesVM => ({
    ...sale,
    turnover: sale.turnover / 100,
    canceledTurnover: sale.canceledTurnover / 100,
    deliveryPrice: sale.deliveryPrice / 100,
    averageBasketValue: sale.averageBasketValue / 100
  })

  return {
    monthlySales: dashboard.monthlySales.map(mapMonthlySales),
    previousYearMonthlySales:
      dashboard.previousYearMonthlySales.map(mapMonthlySales),
    totalSales: {
      ...dashboard.totalSales,
      turnover: dashboard.totalSales.turnover / 100,
      canceledTurnover: dashboard.totalSales.canceledTurnover / 100,
      deliveryPrice: dashboard.totalSales.deliveryPrice / 100,
      averageBasketValue: dashboard.totalSales.averageBasketValue / 100
    },
    topProducts: dashboard.topProducts,
    ordersByDeliveryMethod: dashboard.ordersByDeliveryMethod,
    ordersByLaboratory: dashboard.ordersByLaboratory,
    productQuantitiesByCategory: dashboard.productQuantitiesByCategory,
    productStockStats: dashboard.productStockStats
  }
}
