import { RealDashboardGateway } from '@adapters/secondary/dashboard-gateways/realDashboardGateway'
import { DashboardGateway } from '@core/gateways/dashboardGateway'
import { InMemoryDashboardGateway } from '@core/usecases/dashboard/get-dashboard/inMemoryDashboardGateway'
import { isLocalEnv } from '@utils/env'

const gateway = new InMemoryDashboardGateway()
gateway.feedWith({
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
  previousYearMonthlySales: [
    {
      month: '2024-01',
      count: 180,
      turnover: 900000,
      averageBasketValue: 5000,
      canceledTurnover: 0,
      deliveryPrice: 0
    },
    {
      month: '2024-02',
      count: 250,
      turnover: 1250000,
      averageBasketValue: 5000,
      canceledTurnover: 0,
      deliveryPrice: 0
    },
    {
      month: '2024-03',
      count: 400,
      turnover: 1600000,
      averageBasketValue: 4000,
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
  topProducts: [
    {
      productUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
      name: 'Modilac Expert Riz 3 Lait dès 12 mois 800 g',
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
      deliveryMethodUuid: '505209a2-7acb-4891-b933-e084d786d7ea',
      deliveryMethodName: 'Livraison en point relais Colissimo',
      count: 500
    },
    {
      deliveryMethodUuid: '570bdcfa-b704-4ed2-9fc0-175d687c1d8d',
      deliveryMethodName: 'Retrait en pharmacie',
      count: 300
    }
  ],
  ordersByLaboratory: [
    {
      laboratoryUuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
      laboratoryName: 'Modilac',
      count: 400
    },
    {
      laboratoryUuid: '88362b96-80f7-452b-9ef0-7b85b90d7609',
      laboratoryName: 'Other Lab',
      count: 300
    }
  ],
  productQuantitiesByCategory: [
    {
      uuid: '67362b96-80f7-452b-9ef0-7b85b90d7608',
      name: 'Bébé et Maman',
      count: 450,
      parentUuid: null
    },
    {
      uuid: '570bdcfa-b704-4ed2-9fc0-175d687c1d8d',
      name: 'Santé',
      count: 350,
      parentUuid: null
    }
  ],
  productStockStats: {
    inStockCount: 850,
    outOfStockCount: 150
  }
})

export const useDashboardGateway = (): DashboardGateway => {
  if (isLocalEnv()) {
    return gateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealDashboardGateway(BACKEND_URL)
}
