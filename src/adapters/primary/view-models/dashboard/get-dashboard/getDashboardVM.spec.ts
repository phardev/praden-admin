import { Dashboard } from '@core/entities/dashboard'
import { DashboardVM, getDashboardVM } from './getDashboardVM'
import { createPinia, setActivePinia } from 'pinia'
import { useStatsStore } from '@store/statsStore'

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
          month: '2025-01',
          count: 150,
          turnover: 1250000,
          averageBasketValue: 8333
        },
        {
          month: '2025-02',
          count: 200,
          turnover: 1800000,
          averageBasketValue: 9000
        }
      ],
      totalSales: {
        count: 350,
        turnover: 3050000,
        averageBasketValue: 8714
      },
      topProducts: [
        {
          productUuid: '123',
          name: 'Product A',
          count: 50
        },
        {
          productUuid: '456',
          name: 'Product B',
          count: 30
        }
      ]
    }

    statsStore.dashboard = mockDashboard

    res = getDashboardVM()
    expect(res).toStrictEqual({
      monthlySales: mockDashboard.monthlySales.map((sale) => {
        return {
          ...sale,
          turnover: sale.turnover / 100,
          averageBasketValue: sale.averageBasketValue / 100
        }
      }),
      totalSales: {
        count: mockDashboard.totalSales.count,
        turnover: mockDashboard.totalSales.turnover / 100,
        averageBasketValue: mockDashboard.totalSales.averageBasketValue / 100
      },
      topProducts: mockDashboard.topProducts
    })
  })

  it('should handle empty data', () => {
    res = getDashboardVM()

    expect(res).toStrictEqual({
      monthlySales: [],
      totalSales: {
        count: 0,
        turnover: 0,
        averageBasketValue: 0
      },
      topProducts: []
    })
  })
})
