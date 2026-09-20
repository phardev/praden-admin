import type { OperatorStatisticsReport } from '@core/entities/operatorStatistics'
import type {
  OperatorStatisticsGateway,
  OperatorStatisticsParams
} from '@core/gateways/operatorStatisticsGateway'

export class InMemoryOperatorStatisticsGateway
  implements OperatorStatisticsGateway
{
  private report: OperatorStatisticsReport | undefined
  public lastCalledWith: OperatorStatisticsParams | undefined

  async getOperatorStatistics(
    params: OperatorStatisticsParams
  ): Promise<OperatorStatisticsReport> {
    this.lastCalledWith = params
    if (!this.report) throw new Error('No operator statistics fed')
    return this.report
  }

  feedWith(report: OperatorStatisticsReport) {
    this.report = report
  }
}
