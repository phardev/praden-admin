import { Dashboard } from '@core/entities/dashboard'
import {
  DashboardGateway,
  DashboardParams
} from '@core/gateways/dashboardGateway'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealDashboardGateway
  extends RealGateway
  implements DashboardGateway
{
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async getDashboardData(params: DashboardParams): Promise<Dashboard> {
    const queryParams = new URLSearchParams()

    if (params.productLimit) {
      queryParams.append('productLimit', params.productLimit.toString())
    }
    if (params.startDate) {
      queryParams.append('startDate', params.startDate.toISOString())
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate.toISOString())
    }
    if (params.laboratoryUuid) {
      queryParams.append('laboratoryUuid', params.laboratoryUuid)
    }

    if (params.categoryUuid) {
      queryParams.append('categoryUuid', params.categoryUuid)
    }

    if (params.promotionOnly) {
      queryParams.append('promotionOnly', params.promotionOnly.toString())
    }

    const url = `${this.baseUrl}/dashboard${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`

    try {
      const response = await axiosWithBearer.get<Dashboard>(url)
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }
}
