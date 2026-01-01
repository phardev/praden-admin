import type {
  MonthlySales,
  OrderByDeliveryMethod,
  OrderByLaboratory,
  ProductByCategory,
  ProductStockStats,
  TopProduct,
  TotalSales
} from '@core/entities/dashboard'
import { useStatsStore } from '@store/statsStore'

const getYearFromMonth = (month: string): number => {
  return parseInt(month.split('-')[0], 10)
}

const splitSalesByYear = (
  sales: MonthlySales[]
): { currentYear: MonthlySales[]; nextYear: MonthlySales[] } => {
  if (sales.length === 0) {
    return { currentYear: [], nextYear: [] }
  }
  const firstYear = getYearFromMonth(sales[0].month)
  const currentYear = sales.filter(
    (sale) => getYearFromMonth(sale.month) === firstYear
  )
  const nextYear = sales.filter(
    (sale) => getYearFromMonth(sale.month) === firstYear + 1
  )
  return { currentYear, nextYear }
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
  nextYearMonthlySales: MonthlySalesVM[]
  totalSales: TotalSalesVM
  previousYearTotalSales?: TotalSalesVM
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
      nextYearMonthlySales: [],
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
  const mapSalesToVM = (sales: MonthlySales[]) =>
    sales.map((sale) => ({
      ...sale,
      turnover: sale.turnover / 100,
      canceledTurnover: sale.canceledTurnover / 100,
      deliveryPrice: sale.deliveryPrice / 100,
      averageBasketValue: sale.averageBasketValue / 100
    }))

  const { currentYear, nextYear } = dashboard.nextYearMonthlySales
    ? {
        currentYear: dashboard.monthlySales,
        nextYear: dashboard.nextYearMonthlySales
      }
    : splitSalesByYear(dashboard.monthlySales)

  const mapTotalSalesToVM = (sales: TotalSales): TotalSalesVM => ({
    ...sales,
    turnover: sales.turnover / 100,
    canceledTurnover: sales.canceledTurnover / 100,
    deliveryPrice: sales.deliveryPrice / 100,
    averageBasketValue: sales.averageBasketValue / 100
  })

  const result: DashboardVM = {
    monthlySales: mapSalesToVM(currentYear),
    nextYearMonthlySales: mapSalesToVM(nextYear),
    totalSales: mapTotalSalesToVM(dashboard.totalSales),
    topProducts: dashboard.topProducts,
    ordersByDeliveryMethod: dashboard.ordersByDeliveryMethod,
    ordersByLaboratory: dashboard.ordersByLaboratory,
    productQuantitiesByCategory: dashboard.productQuantitiesByCategory,
    productStockStats: dashboard.productStockStats
  }

  if (dashboard.previousYearTotalSales) {
    result.previousYearTotalSales = mapTotalSalesToVM(
      dashboard.previousYearTotalSales
    )
  }

  return result
}
