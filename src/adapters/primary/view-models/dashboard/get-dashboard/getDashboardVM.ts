import type {
  AbandonedProduct,
  CartStatistics,
  MonthlyCarts,
  MonthlySales,
  OrderByDeliveryMethod,
  OrderByLaboratory,
  ProductByCategory,
  ProductStockStats,
  RevenueByTaxRate,
  RevenueByTaxRateKind,
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
    | 'turnover'
    | 'turnoverHT'
    | 'canceledTurnover'
    | 'deliveryPrice'
    | 'averageBasketValue'
  > {
  turnover: number
  turnoverHT: number
  canceledTurnover: number
  deliveryPrice: number
  averageBasketValue: number
}

export interface RevenueByTaxRateVM {
  percentTaxRate: number
  revenueTTC: number
  kind: RevenueByTaxRateKind
}

export interface MonthlyValueVM {
  month: string
  value: number
}

export interface CartStatisticsVM {
  created: number
  guestCreated: number
  converted: number
  abandoned: number
  inProgress: number
  abandonmentRate: number
  conversionRate: number
  abandonedValue: number
  averageAbandonedValue: number
  monthlyAbandoned: MonthlyValueVM[]
  previousYearMonthlyAbandoned: MonthlyValueVM[]
  monthlyAbandonmentRate: MonthlyValueVM[]
  previousYearMonthlyAbandonmentRate: MonthlyValueVM[]
  topAbandonedProducts: AbandonedProduct[]
}

const roundToOneDecimal = (value: number): number => Math.round(value * 10) / 10

const percentage = (part: number, total: number): number =>
  total === 0 ? 0 : roundToOneDecimal((part / total) * 100)

const abandonmentRateOf = (month: {
  abandoned: number
  converted: number
}): number => percentage(month.abandoned, month.abandoned + month.converted)

const monthlyAbandonedOf = (months: MonthlyCarts[]): MonthlyValueVM[] =>
  months.map(({ month, abandoned }) => ({ month, value: abandoned }))

const monthlyAbandonmentRateOf = (months: MonthlyCarts[]): MonthlyValueVM[] =>
  months.map((month) => ({
    month: month.month,
    value: abandonmentRateOf(month)
  }))

export const emptyCartStatisticsVM = (): CartStatisticsVM => ({
  created: 0,
  guestCreated: 0,
  converted: 0,
  abandoned: 0,
  inProgress: 0,
  abandonmentRate: 0,
  conversionRate: 0,
  abandonedValue: 0,
  averageAbandonedValue: 0,
  monthlyAbandoned: [],
  previousYearMonthlyAbandoned: [],
  monthlyAbandonmentRate: [],
  previousYearMonthlyAbandonmentRate: [],
  topAbandonedProducts: []
})

const cartStatisticsVMOf = ({
  totals,
  monthly,
  previousYearMonthly,
  topAbandonedProducts
}: CartStatistics): CartStatisticsVM => {
  const decided = totals.abandoned + totals.converted
  const abandonedValue = totals.abandonedValue / 100
  return {
    created: totals.created,
    guestCreated: totals.guestCreated,
    converted: totals.converted,
    abandoned: totals.abandoned,
    inProgress: totals.inProgress,
    abandonmentRate: percentage(totals.abandoned, decided),
    conversionRate: percentage(totals.converted, decided),
    abandonedValue,
    averageAbandonedValue:
      totals.abandonedWithValue === 0
        ? 0
        : Math.round((abandonedValue / totals.abandonedWithValue) * 100) / 100,
    monthlyAbandoned: monthlyAbandonedOf(monthly),
    previousYearMonthlyAbandoned: monthlyAbandonedOf(previousYearMonthly),
    monthlyAbandonmentRate: monthlyAbandonmentRateOf(monthly),
    previousYearMonthlyAbandonmentRate:
      monthlyAbandonmentRateOf(previousYearMonthly),
    topAbandonedProducts
  }
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
  revenueByTaxRate: RevenueByTaxRateVM[]
  cartStatistics: CartStatisticsVM
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
        turnoverHT: 0,
        canceledTurnover: 0,
        deliveryPrice: 0,
        averageBasketValue: 0
      },
      previousYearTotalSales: {
        count: 0,
        turnover: 0,
        turnoverHT: 0,
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
      },
      revenueByTaxRate: [],
      cartStatistics: emptyCartStatisticsVM()
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
      turnoverHT: dashboard.totalSales.turnoverHT / 100,
      canceledTurnover: dashboard.totalSales.canceledTurnover / 100,
      deliveryPrice: dashboard.totalSales.deliveryPrice / 100,
      averageBasketValue: dashboard.totalSales.averageBasketValue / 100
    },
    previousYearTotalSales: {
      ...dashboard.previousYearTotalSales,
      turnover: dashboard.previousYearTotalSales.turnover / 100,
      turnoverHT: dashboard.previousYearTotalSales.turnoverHT / 100,
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
    userStatistics: dashboard.userStatistics,
    revenueByTaxRate: dashboard.revenueByTaxRate.map((entry) => ({
      percentTaxRate: entry.percentTaxRate,
      revenueTTC: entry.revenueTTC / 100,
      kind: entry.kind
    })),
    cartStatistics: cartStatisticsVMOf(dashboard.cartStatistics)
  }
}
