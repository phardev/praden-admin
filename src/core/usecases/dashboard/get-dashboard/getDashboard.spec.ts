import { Dashboard } from '@core/entities/dashboard'
import { DashboardParams } from '@core/gateways/dashboardGateway'
import { InMemoryDashboardGateway } from '@core/usecases/dashboard/get-dashboard/inMemoryDashboardGateway'
import { useStatsStore } from '@store/statsStore'
import { createPinia, setActivePinia } from 'pinia'
import { getDashboard } from './getDashboard'

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
          averageBasketValue: 5000,
          canceledTurnover: 0,
          deliveryPrice: 0
        },
        {
          month: '2025-02',
          count: 300,
          turnover: 1500000,
          averageBasketValue: 5000,
          canceledTurnover: 0,
          deliveryPrice: 0
        },
        {
          month: '2025-03',
          count: 500,
          turnover: 2000000,
          averageBasketValue: 4000,
          canceledTurnover: 0,
          deliveryPrice: 0
        }
      ],
      nextYearMonthlySales: [
        {
          month: '2026-01',
          count: 220,
          turnover: 1100000,
          averageBasketValue: 5000,
          canceledTurnover: 0,
          deliveryPrice: 0
        },
        {
          month: '2026-02',
          count: 330,
          turnover: 1650000,
          averageBasketValue: 5000,
          canceledTurnover: 0,
          deliveryPrice: 0
        }
      ],
      totalSales: {
        count: 1000,
        turnover: 4500000,
        averageBasketValue: 4500,
        canceledTurnover: 0,
        deliveryPrice: 0
      },
      previousYearTotalSales: {
        count: 800,
        turnover: 3600000,
        averageBasketValue: 4500,
        canceledTurnover: 0,
        deliveryPrice: 0
      },
      topProducts: [
        {
          productUuid: 'product-1',
          name: 'Modilac Expert Riz 3 Lait dès 12 mois 800 g',
          count: 52,
          categories: [
            {
              uuid: 'modilac-category',
              name: 'Modilac'
            }
          ],
          laboratory: {
            uuid: 'modilac-laboratory',
            name: 'Laboratory 1'
          }
        },
        {
          productUuid: 'product-2',
          name: 'Product 2',
          count: 45,
          categories: [
            {
              uuid: 'product-2-category',
              name: 'Product 2 Category'
            }
          ],
          laboratory: {
            uuid: 'product-2-laboratory',
            name: 'Product 2 Laboratory'
          }
        },
        {
          productUuid: 'product-3',
          name: 'Product 3',
          count: 38,
          categories: [
            {
              uuid: 'product-3-category',
              name: 'Product 3 Category'
            },
            {
              uuid: 'product-3-category-2',
              name: 'Product 3 Category-2'
            }
          ],
          laboratory: {
            uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
            name: 'Product 3 Laboratory'
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
        },
        {
          deliveryMethodUuid: 'b5f26b31-ad03-4aaf-af89-395471795066',
          deliveryMethodName: 'Livraison à domicile Colissimo',
          count: 160
        },
        {
          deliveryMethodUuid: 'e667e186-8b06-44fb-bde5-5842e6006dd4',
          deliveryMethodName: 'Livraison en point relais DPD',
          count: 10
        }
      ],
      productStockStats: {
        inStockCount: 850,
        outOfStockCount: 150
      },
      ordersByLaboratory: [
        {
          laboratoryUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          laboratoryName: 'Laboratory A',
          count: 500
        },
        {
          laboratoryUuid: '570bdcfa-b704-4ed2-9fc0-175d687c1d8d',
          laboratoryName: 'Laboratory B',
          count: 300
        }
      ],
      productQuantitiesByCategory: [
        {
          uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          name: 'Category A',
          count: 400,
          parentUuid: null
        },
        {
          uuid: '570bdcfa-b704-4ed2-9fc0-175d687c1d8d',
          name: 'Category B',
          count: 200,
          parentUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608'
        }
      ]
    }
    dashboardGateway.feedWith(mockData)
  })

  it('should retrieve dashboard data with default parameters', async () => {
    await whenGetDashboardData()
    expect(statsStore.dashboard).toStrictEqual(mockData)
  })

  it('should include orders by delivery method in dashboard data', async () => {
    await whenGetDashboardData()
    expect(statsStore.dashboard.ordersByDeliveryMethod).toStrictEqual(
      mockData.ordersByDeliveryMethod
    )
  })

  it('should include product stock statistics in dashboard data', async () => {
    await whenGetDashboardData()
    expect(statsStore.dashboard.productStockStats).toStrictEqual(
      mockData.productStockStats
    )
  })

  it('should limit the number of top products based on productLimit parameter', async () => {
    params = {
      productLimit: 2
    }
    await whenGetDashboardData()
    expect(statsStore.dashboard).toStrictEqual({
      monthlySales: mockData.monthlySales,
      nextYearMonthlySales: mockData.nextYearMonthlySales,
      totalSales: mockData.totalSales,
      previousYearTotalSales: mockData.previousYearTotalSales,
      topProducts: [mockData.topProducts[0], mockData.topProducts[1]],
      ordersByDeliveryMethod: mockData.ordersByDeliveryMethod,
      ordersByLaboratory: mockData.ordersByLaboratory,
      productQuantitiesByCategory: mockData.productQuantitiesByCategory,
      productStockStats: mockData.productStockStats
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
      nextYearMonthlySales: mockData.nextYearMonthlySales,
      totalSales: {
        count: mockData.monthlySales[1].count,
        turnover: mockData.monthlySales[1].turnover,
        averageBasketValue: mockData.monthlySales[1].averageBasketValue,
        canceledTurnover: mockData.monthlySales[1].canceledTurnover,
        deliveryPrice: mockData.monthlySales[1].deliveryPrice
      },
      previousYearTotalSales: mockData.previousYearTotalSales,
      topProducts: mockData.topProducts,
      ordersByDeliveryMethod: mockData.ordersByDeliveryMethod,
      ordersByLaboratory: mockData.ordersByLaboratory,
      productQuantitiesByCategory: mockData.productQuantitiesByCategory,
      productStockStats: mockData.productStockStats
    })
  })

  it('should filter monthly sales based on laboratory uuid', async () => {
    params = {
      laboratoryUuid: 'modilac-laboratory'
    }
    await whenGetDashboardData()
    expect(statsStore.dashboard).toStrictEqual({
      monthlySales: mockData.monthlySales,
      nextYearMonthlySales: mockData.nextYearMonthlySales,
      totalSales: mockData.totalSales,
      previousYearTotalSales: mockData.previousYearTotalSales,
      topProducts: [mockData.topProducts[0]],
      ordersByDeliveryMethod: mockData.ordersByDeliveryMethod,
      ordersByLaboratory: mockData.ordersByLaboratory,
      productQuantitiesByCategory: mockData.productQuantitiesByCategory,
      productStockStats: mockData.productStockStats
    })
  })

  it('should filter top products based on category uuid', async () => {
    params = {
      categoryUuid: 'product-3-category-2'
    }
    await whenGetDashboardData()
    expect(statsStore.dashboard).toStrictEqual({
      monthlySales: mockData.monthlySales,
      nextYearMonthlySales: mockData.nextYearMonthlySales,
      totalSales: mockData.totalSales,
      previousYearTotalSales: mockData.previousYearTotalSales,
      topProducts: [mockData.topProducts[2]],
      ordersByDeliveryMethod: mockData.ordersByDeliveryMethod,
      ordersByLaboratory: mockData.ordersByLaboratory,
      productQuantitiesByCategory: mockData.productQuantitiesByCategory,
      productStockStats: mockData.productStockStats
    })
  })

  it('should pass timezone parameter to gateway', async () => {
    params = {
      timezone: 'Europe/Paris'
    }
    await whenGetDashboardData()
    expect(dashboardGateway.receivedTimezone).toStrictEqual('Europe/Paris')
  })

  const whenGetDashboardData = async () => {
    await getDashboard(params, dashboardGateway)
  }
})
