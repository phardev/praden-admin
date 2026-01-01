import { Dashboard } from '@core/entities/dashboard'
import { useStatsStore } from '@store/statsStore'
import { createPinia, setActivePinia } from 'pinia'
import { DashboardVM, getDashboardVM } from './getDashboardVM'

describe('getDashboardVM', () => {
  let res: DashboardVM
  let statsStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    statsStore = useStatsStore()
  })

  it('should split monthly sales by year when backend returns combined data', () => {
    const mockDashboard = {
      monthlySales: [
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
        },
        {
          month: '2026-01',
          count: 160,
          turnover: 1350000,
          canceledTurnover: 22000,
          averageBasketValue: 8438,
          deliveryPrice: 11000
        }
      ],
      totalSales: {
        count: 510,
        turnover: 4400000,
        canceledTurnover: 67000,
        averageBasketValue: 8627,
        deliveryPrice: 36000
      },
      previousYearTotalSales: {
        count: 400,
        turnover: 3500000,
        canceledTurnover: 50000,
        averageBasketValue: 8750,
        deliveryPrice: 30000
      },
      topProducts: [],
      ordersByDeliveryMethod: [],
      ordersByLaboratory: [],
      productQuantitiesByCategory: [],
      productStockStats: {
        inStockCount: 750,
        outOfStockCount: 250
      }
    }

    statsStore.dashboard = mockDashboard

    res = getDashboardVM()

    expect(res).toStrictEqual({
      monthlySales: [
        {
          month: '2025-01',
          count: 150,
          turnover: 12500,
          canceledTurnover: 200,
          averageBasketValue: 83.33,
          deliveryPrice: 100
        },
        {
          month: '2025-02',
          count: 200,
          turnover: 18000,
          canceledTurnover: 250,
          averageBasketValue: 90,
          deliveryPrice: 150
        }
      ],
      nextYearMonthlySales: [
        {
          month: '2026-01',
          count: 160,
          turnover: 13500,
          canceledTurnover: 220,
          averageBasketValue: 84.38,
          deliveryPrice: 110
        }
      ],
      previousYearMonthlySales: [],
      totalSales: {
        count: 510,
        turnover: 44000,
        canceledTurnover: 670,
        averageBasketValue: 86.27,
        deliveryPrice: 360
      },
      previousYearTotalSales: {
        count: 400,
        turnover: 35000,
        canceledTurnover: 500,
        averageBasketValue: 87.5,
        deliveryPrice: 300
      },
      topProducts: [],
      ordersByDeliveryMethod: [],
      ordersByLaboratory: [],
      productQuantitiesByCategory: [],
      productStockStats: {
        inStockCount: 750,
        outOfStockCount: 250
      }
    })
  })

  it('should convert prices from cents to euros', () => {
    const mockDashboard: Dashboard = {
      monthlySales: [
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
        count: 350,
        turnover: 3050000,
        canceledTurnover: 55000,
        averageBasketValue: 8714,
        deliveryPrice: 25000
      },
      previousYearTotalSales: {
        count: 280,
        turnover: 2400000,
        canceledTurnover: 45000,
        averageBasketValue: 8571,
        deliveryPrice: 20000
      },
      topProducts: [
        {
          productUuid: '123',
          name: 'Product A',
          count: 50,
          categories: [
            {
              uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
              name: 'Product A Category'
            },
            {
              uuid: '67362b96-80f7-452b-9ef0-7b85b90d7602',
              name: 'Product A Category-2'
            }
          ],
          laboratory: {
            uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
            name: 'Product A Laboratory'
          }
        },
        {
          productUuid: '456',
          name: 'Product B',
          count: 30,
          categories: [
            {
              uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
              name: 'Product B Category'
            }
          ],
          laboratory: {
            uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
            name: 'Product B Laboratory'
          }
        }
      ],
      ordersByDeliveryMethod: [
        {
          deliveryMethodUuid: '505209a2-7acb-4891-b933-e084d786d7ea',
          deliveryMethodName: 'Livraison en point relais Colissimo',
          count: 1154
        },
        {
          deliveryMethodUuid: '570bdcfa-b704-4ed2-9fc0-175d687c1d8d',
          deliveryMethodName: 'Retrait en pharmacie',
          count: 316
        }
      ],
      ordersByLaboratory: [
        {
          laboratoryUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          laboratoryName: 'Laboratory A',
          count: 1154
        },
        {
          laboratoryUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          laboratoryName: 'Laboratory B',
          count: 316
        }
      ],
      productQuantitiesByCategory: [
        {
          uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          name: 'Category A',
          count: 1154,
          parentUuid: null
        },
        {
          uuid: '570bdcfa-b704-4ed2-9fc0-175d687c1d8d',
          name: 'Category B',
          count: 316,
          parentUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608'
        }
      ],
      productStockStats: {
        inStockCount: 750,
        outOfStockCount: 250
      },
      nextYearMonthlySales: [
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
      ]
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
      nextYearMonthlySales: mapSalesToExpected(
        mockDashboard.nextYearMonthlySales!
      ),
      previousYearMonthlySales: [],
      totalSales: {
        count: mockDashboard.totalSales.count,
        turnover: mockDashboard.totalSales.turnover / 100,
        canceledTurnover: mockDashboard.totalSales.canceledTurnover / 100,
        averageBasketValue: mockDashboard.totalSales.averageBasketValue / 100,
        deliveryPrice: mockDashboard.totalSales.deliveryPrice / 100
      },
      previousYearTotalSales: {
        count: mockDashboard.previousYearTotalSales.count,
        turnover: mockDashboard.previousYearTotalSales.turnover / 100,
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
      productStockStats: mockDashboard.productStockStats
    })
  })

  it('should handle empty data', () => {
    res = getDashboardVM()

    expect(res).toStrictEqual({
      monthlySales: [],
      nextYearMonthlySales: [],
      previousYearMonthlySales: [],
      totalSales: {
        count: 0,
        turnover: 0,
        canceledTurnover: 0,
        averageBasketValue: 0,
        deliveryPrice: 0
      },
      previousYearTotalSales: {
        count: 0,
        turnover: 0,
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
      }
    })
  })
})
