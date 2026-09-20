import { RealOperatorStatisticsGateway } from '@adapters/secondary/operator-statistics-gateways/realOperatorStatisticsGateway'
import { OperatorStatisticsGateway } from '@core/gateways/operatorStatisticsGateway'
import { InMemoryOperatorStatisticsGateway } from '@core/usecases/staff/get-operator-statistics/inMemoryOperatorStatisticsGateway'
import { isLocalEnv } from '@utils/env'
import { operatorStatisticsReport } from '@utils/testData/operatorStatistics'

const gateway = new InMemoryOperatorStatisticsGateway()
gateway.feedWith(operatorStatisticsReport)

export const useOperatorStatisticsGateway = (): OperatorStatisticsGateway => {
  if (isLocalEnv()) {
    return gateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealOperatorStatisticsGateway(BACKEND_URL)
}
