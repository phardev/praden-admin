import type { Dashboard } from '@core/entities/dashboard'
import { useStatsStore } from '@store/statsStore'
import { createPinia, setActivePinia } from 'pinia'
import {
  calculateEvolution,
  DashboardVM,
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
        canceledTurnover: 49000,
        averageBasketValue: 8784,
        deliveryPrice: 27000
      },
      previousYearTotalSales: {
        count: 350,
        turnover: 3050000,
        canceledTurnover: 45000,
        averageBasketValue: 8714,
        deliveryPrice: 25000
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
      }
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
