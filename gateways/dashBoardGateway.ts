import { RealDashboardGateway } from '@adapters/secondary/dashboard-gateways/realDashboardGateway'
import { DashboardGateway } from '@core/gateways/dashboardGateway'
import { InMemoryDashboardGateway } from '@core/usecases/dashboard/get-dashboard/inMemoryDashboardGateway'
import { isLocalEnv } from '@utils/env'

const gateway = new InMemoryDashboardGateway()
gateway.feedWith({
  monthlySales: [
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
  previousYearMonthlySales: [
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
  totalSales: {
    count: 550,
    turnover: 2750000,
    averageBasketValue: 5000,
    canceledTurnover: 0,
    deliveryPrice: 0
  },
  previousYearTotalSales: {
    count: 1000,
    turnover: 4500000,
    averageBasketValue: 4500,
    canceledTurnover: 0,
    deliveryPrice: 0
  },
  topProducts: [
    {
      productUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
      name: 'Modilac Expert Riz 3 Lait dès 12 mois 800 g',
      ean13: '3401598753214',
      count: 52,
      categories: [
        {
          uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          name: 'Modilac'
        }
      ],
      laboratory: {
        uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
        name: 'Modilac'
      }
    },
    {
      productUuid: '88362b96-80f7-452b-9ef0-7b85b90d7609',
      name: 'Product 2',
      ean13: '3401598753215',
      count: 45,
      categories: [
        {
          uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          name: 'Product 2 Category'
        }
      ],
      laboratory: {
        uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
        name: 'Product 2 Laboratory'
      }
    },
    {
      productUuid: '99362b96-80f7-452b-9ef0-7b85b90d7610',
      name: 'Product 3',
      ean13: '3401598753216',
      count: 38,
      categories: [
        {
          uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
          name: 'Product 3 Category'
        },
        {
          uuid: '67362b96-80f7-452b-9ef0-7b85b90d7602',
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
      deliveryMethodUuid: '11111111-1111-1111-1111-111111111111',
      deliveryMethodName: 'Standard',
      count: 500
    },
    {
      deliveryMethodUuid: '22222222-2222-2222-2222-222222222222',
      deliveryMethodName: 'Express',
      count: 300
    }
  ],
  ordersByLaboratory: [
    {
      laboratoryUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
      laboratoryName: 'Modilac',
      count: 200
    }
  ],
  productQuantitiesByCategory: [
    {
      uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
      name: 'Category 1',
      count: 100
    }
  ],
  productStockStats: {
    inStockCount: 450,
    outOfStockCount: 50
  },
  userStatistics: {
    totalCustomers: 1250,
    customersWithOrders: 820,
    newsletterSubscribers: 680,
    monthlyNewsletterSubscriptions: [
      { month: '2025-03', count: 45 },
      { month: '2025-04', count: 52 },
      { month: '2025-05', count: 38 },
      { month: '2025-06', count: 61 },
      { month: '2025-07', count: 55 },
      { month: '2025-08', count: 48 },
      { month: '2025-09', count: 72 },
      { month: '2025-10', count: 68 },
      { month: '2025-11', count: 85 },
      { month: '2025-12', count: 92 },
      { month: '2026-01', count: 78 },
      { month: '2026-02', count: 86 }
    ],
    newsletterAdoptionRate: {
      subscribers: 680,
      nonSubscribers: 570
    }
  }
})

export const useDashboardGateway = (): DashboardGateway => {
  if (isLocalEnv()) {
    return gateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealDashboardGateway(BACKEND_URL)
}
