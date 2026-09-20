import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { OperatorStatisticsReport } from '@core/entities/operatorStatistics'
import {
  OperatorStatisticsGateway,
  OperatorStatisticsParams
} from '@core/gateways/operatorStatisticsGateway'

export class RealOperatorStatisticsGateway
  extends RealGateway
  implements OperatorStatisticsGateway
{
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async getOperatorStatistics(
    params: OperatorStatisticsParams
  ): Promise<OperatorStatisticsReport> {
    const queryParams = new URLSearchParams()

    if (params.startDate) {
      queryParams.append('startDate', params.startDate.toISOString())
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate.toISOString())
    }
    if (params.timezone) {
      queryParams.append('timezone', params.timezone)
    }

    const url = `${this.baseUrl}/staff/statistics${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`

    const response = await axiosWithBearer.get<OperatorStatisticsReport>(url)
    return response.data
  }
}
