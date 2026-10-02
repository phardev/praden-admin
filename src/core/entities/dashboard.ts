import type { UUID } from '@core/types/types'

export interface ProductStockStats {
  inStockCount: number
  outOfStockCount: number
}

export interface MonthlyNewsletterSubscription {
  month: string
  count: number
}

export interface NewsletterAdoption {
  subscribers: number
  nonSubscribers: number
}

export interface UserStatistics {
  totalCustomers: number
  customersWithOrders: number
  newsletterSubscribers: number
  monthlyNewsletterSubscriptions: MonthlyNewsletterSubscription[]
  newsletterAdoptionRate: NewsletterAdoption
}

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
  turnoverHT: number
  canceledTurnover: number
  deliveryPrice: number
  averageBasketValue: number
}

export type RevenueByTaxRateKind = 'PRODUCT' | 'DELIVERY'

export interface RevenueByTaxRate {
  percentTaxRate: number
  revenueTTC: number
  kind: RevenueByTaxRateKind
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
  ean13: string
  count: number
  categories: Array<TopProductCategory>
  laboratory: TopProductLaboratory
}

export interface OrderByDeliveryMethod {
  deliveryMethodUuid: UUID
  deliveryMethodName: string
  count: number
}

export interface OrderByLaboratory {
  laboratoryUuid: UUID
  laboratoryName: string
  count: number
}

export interface ProductByCategory {
  uuid: UUID
  name: string
  count: number
  parentUuid?: UUID | null
}

export interface MonthlyCarts {
  month: string
  created: number
  guestCreated: number
  converted: number
  abandoned: number
  abandonedWithValue: number
  inProgress: number
  abandonedValue: number
}

export interface CartTotals {
  created: number
  guestCreated: number
  converted: number
  abandoned: number
  abandonedWithValue: number
  inProgress: number
  abandonedValue: number
}

export interface AbandonedProduct {
  productUuid: string
  name: string
  ean13: string
  count: number
}

export interface CartStatistics {
  totals: CartTotals
  monthly: MonthlyCarts[]
  previousYearMonthly: MonthlyCarts[]
  topAbandonedProducts: AbandonedProduct[]
}

export const emptyCartStatistics = (): CartStatistics => ({
  totals: {
    created: 0,
    guestCreated: 0,
    converted: 0,
    abandoned: 0,
    abandonedWithValue: 0,
    inProgress: 0,
    abandonedValue: 0
  },
  monthly: [],
  previousYearMonthly: [],
  topAbandonedProducts: []
})

export interface Dashboard {
  monthlySales: MonthlySales[]
  previousYearMonthlySales: MonthlySales[]
  totalSales: TotalSales
  previousYearTotalSales: TotalSales
  topProducts: TopProduct[]
  ordersByDeliveryMethod: OrderByDeliveryMethod[]
  ordersByLaboratory: OrderByLaboratory[]
  productQuantitiesByCategory: ProductByCategory[]
  productStockStats: ProductStockStats
  userStatistics: UserStatistics
  revenueByTaxRate: RevenueByTaxRate[]
  cartStatistics: CartStatistics
}
