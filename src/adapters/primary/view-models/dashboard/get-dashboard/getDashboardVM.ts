import type {
  MonthlySales,
  OrderByDeliveryMethod,
  OrderByLaboratory,
  ProductByCategory,
  ProductStockStats,
  TopProduct,
  TotalSales,
  UserStatistics
} from '@core/entities/dashboard'
import { useStatsStore } from '@store/statsStore'

export const calculateEvolution = (
  current: number,
  previous: number
): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return ((current - previous) / previous) * 100
}

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
  previousYearTotalSales: TotalSalesVM
  topProducts: TopProduct[]
  ordersByDeliveryMethod: OrderByDeliveryMethod[]
  ordersByLaboratory: OrderByLaboratory[]
  productQuantitiesByCategory: ProductByCategory[]
  productStockStats: ProductStockStats
  userStatistics: UserStatistics
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
      previousYearTotalSales: {
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
      },
      userStatistics: {
        totalCustomers: 0,
        customersWithOrders: 0,
        newsletterSubscribers: 0,
        monthlyNewsletterSubscriptions: [],
        newsletterAdoptionRate: {
          subscribers: 0,
          nonSubscribers: 0
        }
      }
    }
  }

  const mapSalesToVM = (sales: MonthlySales[]) =>
    sales.map((sale) => ({
      ...sale,
      turnover: sale.turnover / 100,
      canceledTurnover: sale.canceledTurnover / 100,
      deliveryPrice: sale.deliveryPrice / 100,
      averageBasketValue: sale.averageBasketValue / 100
    }))

  return {
    monthlySales: mapSalesToVM(dashboard.monthlySales),
    previousYearMonthlySales: mapSalesToVM(dashboard.previousYearMonthlySales),
    totalSales: {
      ...dashboard.totalSales,
      turnover: dashboard.totalSales.turnover / 100,
      canceledTurnover: dashboard.totalSales.canceledTurnover / 100,
      deliveryPrice: dashboard.totalSales.deliveryPrice / 100,
      averageBasketValue: dashboard.totalSales.averageBasketValue / 100
    },
    previousYearTotalSales: {
      ...dashboard.previousYearTotalSales,
      turnover: dashboard.previousYearTotalSales.turnover / 100,
      canceledTurnover: dashboard.previousYearTotalSales.canceledTurnover / 100,
      deliveryPrice: dashboard.previousYearTotalSales.deliveryPrice / 100,
      averageBasketValue:
        dashboard.previousYearTotalSales.averageBasketValue / 100
    },
    topProducts: dashboard.topProducts,
    ordersByDeliveryMethod: dashboard.ordersByDeliveryMethod,
    ordersByLaboratory: dashboard.ordersByLaboratory,
    productQuantitiesByCategory: dashboard.productQuantitiesByCategory,
    productStockStats: dashboard.productStockStats,
    userStatistics: dashboard.userStatistics
  }
}
