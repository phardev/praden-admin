import {
  type CartStatistics,
  type Dashboard,
  emptyCartStatistics
} from '@core/entities/dashboard'
import { useStatsStore } from '@store/statsStore'
import { createPinia, setActivePinia } from 'pinia'
import {
  calculateEvolution,
  DashboardVM,
  emptyCartStatisticsVM,
  getDashboardVM
} from './getDashboardVM'

describe('getDashboardVM', () => {
  let res: DashboardVM
  let statsStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    statsStore = useStatsStore()
  })

  it('should convert prices from cents to euros', () => {
    const mockDashboard: Dashboard = {
      monthlySales: [
        {
          month: '2026-01',
          count: 160,
          turnover: 1350000,
          canceledTurnover: 22000,
          averageBasketValue: 8438,
          deliveryPrice: 11000
        },
        {
          month: '2026-02',
          count: 210,
          turnover: 1900000,
          canceledTurnover: 27000,
          averageBasketValue: 9048,
          deliveryPrice: 16000
        }
      ],
      previousYearMonthlySales: [
        {
          month: '2025-01',
          count: 150,
          turnover: 1250000,
          canceledTurnover: 20000,
          averageBasketValue: 8333,
          deliveryPrice: 10000
        },
        {
          month: '2025-02',
          count: 200,
          turnover: 1800000,
          canceledTurnover: 25000,
          averageBasketValue: 9000,
          deliveryPrice: 15000
        }
      ],
      totalSales: {
        count: 370,
        turnover: 3250000,
        turnoverHT: 2800000,
        canceledTurnover: 49000,
        averageBasketValue: 8784,
        deliveryPrice: 27000
      },
      previousYearTotalSales: {
        count: 350,
        turnover: 3050000,
        turnoverHT: 2600000,
        canceledTurnover: 45000,
        averageBasketValue: 8714,
        deliveryPrice: 25000
      },
      topProducts: [
        {
          productUuid: '123',
          name: 'Product A',
          ean13: '3401598753214',
          count: 50,
          categories: [
            {
              uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
              name: 'Product A Category'
            }
          ],
          laboratory: {
            uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
            name: 'Product A Laboratory'
          }
        }
      ],
      ordersByDeliveryMethod: [
        {
          deliveryMethodUuid: '505209a2-7acb-4891-b933-e084d786d7ea',
          deliveryMethodName: 'Livraison en point relais Colissimo',
          count: 1154
        }
      ],
      ordersByLaboratory: [
        {
          laboratoryUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          laboratoryName: 'Laboratory A',
          count: 1154
        }
      ],
      productQuantitiesByCategory: [
        {
          uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          name: 'Category A',
          count: 1154,
          parentUuid: null
        }
      ],
      productStockStats: {
        inStockCount: 750,
        outOfStockCount: 250
      },
      userStatistics: {
        totalCustomers: 1250,
        customersWithOrders: 820,
        newsletterSubscribers: 680,
        monthlyNewsletterSubscriptions: [
          { month: '2026-01', count: 78 },
          { month: '2026-02', count: 86 }
        ],
        newsletterAdoptionRate: {
          subscribers: 680,
          nonSubscribers: 570
        }
      },
      revenueByTaxRate: [
        { percentTaxRate: 2.1, revenueTTC: 500000, kind: 'PRODUCT' },
        { percentTaxRate: 20, revenueTTC: 1200000, kind: 'PRODUCT' },
        { percentTaxRate: 20, revenueTTC: 80000, kind: 'DELIVERY' }
      ],
      cartStatistics: emptyCartStatistics()
    }

    statsStore.dashboard = mockDashboard

    const mapSalesToExpected = (sales: typeof mockDashboard.monthlySales) =>
      sales.map((sale) => ({
        ...sale,
        turnover: sale.turnover / 100,
        canceledTurnover: sale.canceledTurnover / 100,
        averageBasketValue: sale.averageBasketValue / 100,
        deliveryPrice: sale.deliveryPrice / 100
      }))

    res = getDashboardVM()
    expect(res).toStrictEqual({
      monthlySales: mapSalesToExpected(mockDashboard.monthlySales),
      previousYearMonthlySales: mapSalesToExpected(
        mockDashboard.previousYearMonthlySales
      ),
      totalSales: {
        count: mockDashboard.totalSales.count,
        turnover: mockDashboard.totalSales.turnover / 100,
        turnoverHT: mockDashboard.totalSales.turnoverHT / 100,
        canceledTurnover: mockDashboard.totalSales.canceledTurnover / 100,
        averageBasketValue: mockDashboard.totalSales.averageBasketValue / 100,
        deliveryPrice: mockDashboard.totalSales.deliveryPrice / 100
      },
      previousYearTotalSales: {
        count: mockDashboard.previousYearTotalSales.count,
        turnover: mockDashboard.previousYearTotalSales.turnover / 100,
        turnoverHT: mockDashboard.previousYearTotalSales.turnoverHT / 100,
        canceledTurnover:
          mockDashboard.previousYearTotalSales.canceledTurnover / 100,
        averageBasketValue:
          mockDashboard.previousYearTotalSales.averageBasketValue / 100,
        deliveryPrice: mockDashboard.previousYearTotalSales.deliveryPrice / 100
      },
      topProducts: mockDashboard.topProducts,
      ordersByDeliveryMethod: mockDashboard.ordersByDeliveryMethod,
      ordersByLaboratory: mockDashboard.ordersByLaboratory,
      productQuantitiesByCategory: mockDashboard.productQuantitiesByCategory,
      productStockStats: mockDashboard.productStockStats,
      userStatistics: mockDashboard.userStatistics,
      revenueByTaxRate: mockDashboard.revenueByTaxRate.map((entry) => ({
        percentTaxRate: entry.percentTaxRate,
        revenueTTC: entry.revenueTTC / 100,
        kind: entry.kind
      })),
      cartStatistics: emptyCartStatisticsVM()
    })
  })

  it('should derive the cart rates and amounts in euros from the cart statistics', () => {
    const cartStatistics: CartStatistics = {
      totals: {
        created: 90,
        guestCreated: 35,
        converted: 55,
        abandoned: 30,
        abandonedWithValue: 25,
        inProgress: 5,
        abandonedValue: 90000
      },
      monthly: [
        {
          month: '2026-01',
          created: 40,
          guestCreated: 15,
          converted: 25,
          abandoned: 12,
          abandonedWithValue: 12,
          inProgress: 3,
          abandonedValue: 36000
        },
        {
          month: '2026-02',
          created: 50,
          guestCreated: 20,
          converted: 30,
          abandoned: 18,
          abandonedWithValue: 18,
          inProgress: 2,
          abandonedValue: 54000
        }
      ],
      previousYearMonthly: [
        {
          month: '2025-01',
          created: 30,
          guestCreated: 10,
          converted: 20,
          abandoned: 10,
          abandonedWithValue: 10,
          inProgress: 0,
          abandonedValue: 27000
        }
      ],
      topAbandonedProducts: [
        {
          productUuid: '123',
          name: 'Product A',
          ean13: '3401598753214',
          count: 7
        }
      ]
    }
    statsStore.dashboard = { ...emptyDashboard(), cartStatistics }

    expect(getDashboardVM().cartStatistics).toStrictEqual({
      created: 90,
      guestCreated: 35,
      converted: 55,
      abandoned: 30,
      inProgress: 5,
      abandonmentRate: 35.3,
      conversionRate: 64.7,
      abandonedValue: 900,
      averageAbandonedValue: 36,
      monthlyAbandoned: [
        { month: '2026-01', value: 12 },
        { month: '2026-02', value: 18 }
      ],
      previousYearMonthlyAbandoned: [{ month: '2025-01', value: 10 }],
      monthlyAbandonmentRate: [
        { month: '2026-01', value: 32.4 },
        { month: '2026-02', value: 37.5 }
      ],
      previousYearMonthlyAbandonmentRate: [{ month: '2025-01', value: 33.3 }],
      topAbandonedProducts: cartStatistics.topAbandonedProducts
    })
  })

  it('should handle empty data', () => {
    res = getDashboardVM()

    expect(res).toStrictEqual({
      monthlySales: [],
      previousYearMonthlySales: [],
      totalSales: {
        count: 0,
        turnover: 0,
        turnoverHT: 0,
        canceledTurnover: 0,
        averageBasketValue: 0,
        deliveryPrice: 0
      },
      previousYearTotalSales: {
        count: 0,
        turnover: 0,
        turnoverHT: 0,
        canceledTurnover: 0,
        averageBasketValue: 0,
        deliveryPrice: 0
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
    })
  })

  const emptyDashboard = (): Dashboard => ({
    monthlySales: [],
    previousYearMonthlySales: [],
    totalSales: {
      count: 0,
      turnover: 0,
      turnoverHT: 0,
      canceledTurnover: 0,
      averageBasketValue: 0,
      deliveryPrice: 0
    },
    previousYearTotalSales: {
      count: 0,
      turnover: 0,
      turnoverHT: 0,
      canceledTurnover: 0,
      averageBasketValue: 0,
      deliveryPrice: 0
    },
    topProducts: [],
    ordersByDeliveryMethod: [],
    ordersByLaboratory: [],
    productQuantitiesByCategory: [],
    productStockStats: { inStockCount: 0, outOfStockCount: 0 },
    userStatistics: {
      totalCustomers: 0,
      customersWithOrders: 0,
      newsletterSubscribers: 0,
      monthlyNewsletterSubscriptions: [],
      newsletterAdoptionRate: { subscribers: 0, nonSubscribers: 0 }
    },
    revenueByTaxRate: [],
    cartStatistics: emptyCartStatistics()
  })
})

describe('calculateEvolution', () => {
  it('should calculate negative evolution when current year is lower than previous year', () => {
    const result = calculateEvolution(500, 1000)

    expect(result).toBe(-50)
  })

  it('should calculate positive evolution when current year is higher than previous year', () => {
    const result = calculateEvolution(1200, 1000)

    expect(result).toBe(20)
  })
})
