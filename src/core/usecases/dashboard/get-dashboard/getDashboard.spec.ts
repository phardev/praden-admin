import { Dashboard } from '@core/entities/dashboard'
import { InMemoryDashboardGateway } from '@core/usecases/dashboard/get-dashboard/inMemoryDashboardGateway'
import { getDashboard } from './getDashboard'
import { DashboardParams } from '@core/gateways/dashboardGateway'
import { createPinia, setActivePinia } from 'pinia'
import { useStatsStore } from '@store/statsStore'

describe('GetDashboard', () => {
  let dashboardGateway: InMemoryDashboardGateway
  let params: DashboardParams
  let mockData: Dashboard
  let statsStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    statsStore = useStatsStore()
    dashboardGateway = new InMemoryDashboardGateway()
    params = {}
    mockData = {
      monthlySales: [
        {
          month: '2025-01',
          count: 200,
          turnover: 1000000,
          averageBasketValue: 5000
        },
        {
          month: '2025-02',
          count: 300,
          turnover: 1500000,
          averageBasketValue: 5000
        },
        {
          month: '2025-03',
          count: 500,
          turnover: 2000000,
          averageBasketValue: 4000
        }
      ],
      totalSales: {
        count: 1000,
        turnover: 4500000,
        averageBasketValue: 4500
      },
      topProducts: [
        {
          productUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          name: 'Modilac Expert Riz 3 Lait dès 12 mois 800 g',
          count: 52
        },
        {
          productUuid: '88362b96-80f7-452b-9ef0-7b85b90d7609',
          name: 'Product 2',
          count: 45
        },
        {
          productUuid: '99362b96-80f7-452b-9ef0-7b85b90d7610',
          name: 'Product 3',
          count: 38
        }
      ]
    }
    dashboardGateway.feedWith(mockData)
  })

  it('should retrieve dashboard data with default parameters', async () => {
    await whenGetDashboardData()
    expect(statsStore.dashboard).toStrictEqual(mockData)
  })

  it('should limit the number of top products based on productLimit parameter', async () => {
    params = {
      productLimit: 2
    }
    await whenGetDashboardData()
    expect(statsStore.dashboard).toStrictEqual({
      monthlySales: mockData.monthlySales,
      totalSales: mockData.totalSales,
      topProducts: [mockData.topProducts[0], mockData.topProducts[1]]
    })
  })

  it('should filter monthly sales based on date range', async () => {
    params = {
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-28')
    }
    await whenGetDashboardData()
    expect(statsStore.dashboard).toStrictEqual({
      monthlySales: [mockData.monthlySales[1]],
      totalSales: {
        count: mockData.monthlySales[1].count,
        turnover: mockData.monthlySales[1].turnover,
        averageBasketValue: mockData.monthlySales[1].averageBasketValue
      },
      topProducts: mockData.topProducts
    })
  })

  const whenGetDashboardData = async () => {
    await getDashboard(params, dashboardGateway)
  }
})
