import type { OperatorStatisticsReport } from '@core/entities/operatorStatistics'

export interface OperatorStatisticsParams {
  startDate?: Date
  endDate?: Date
  timezone?: string
}

export interface OperatorStatisticsGateway {
  getOperatorStatistics(
    params: OperatorStatisticsParams
  ): Promise<OperatorStatisticsReport>
}
