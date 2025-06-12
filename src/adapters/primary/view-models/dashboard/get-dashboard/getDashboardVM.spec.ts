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
          categoryUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          categoryName: 'Category A',
          count: 1154,
          parentUuid: null
        },
        {
          categoryUuid: '570bdcfa-b704-4ed2-9fc0-175d687c1d8d',
          categoryName: 'Category B',
          count: 316,
          parentUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608'
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
          canceledTurnover: sale.canceledTurnover / 100,
          averageBasketValue: sale.averageBasketValue / 100,
          deliveryPrice: sale.deliveryPrice / 100
        }
      }),
      totalSales: {
        count: mockDashboard.totalSales.count,
        turnover: mockDashboard.totalSales.turnover / 100,
        canceledTurnover: mockDashboard.totalSales.canceledTurnover / 100,
        averageBasketValue: mockDashboard.totalSales.averageBasketValue / 100,
        deliveryPrice: mockDashboard.totalSales.deliveryPrice / 100
      },
      topProducts: mockDashboard.topProducts,
      ordersByDeliveryMethod: mockDashboard.ordersByDeliveryMethod,
      ordersByLaboratory: mockDashboard.ordersByLaboratory,
      productQuantitiesByCategory: mockDashboard.productQuantitiesByCategory
    })
  })

  it('should handle empty data', () => {
    res = getDashboardVM()

    expect(res).toStrictEqual({
      monthlySales: [],
      totalSales: {
        count: 0,
        turnover: 0,
        canceledTurnover: 0,
        averageBasketValue: 0,
        deliveryPrice: 0
      },
      topProducts: [],
      ordersByDeliveryMethod: [],
      ordersByLaboratory: [],
      productQuantitiesByCategory: []
    })
  })
})
