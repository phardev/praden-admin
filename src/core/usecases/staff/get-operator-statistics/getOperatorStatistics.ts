import type {
  OperatorStatisticsGateway,
  OperatorStatisticsParams
} from '@core/gateways/operatorStatisticsGateway'
import { useStatsStore } from '@store/statsStore'

export const getOperatorStatistics = async (
  params: OperatorStatisticsParams,
  operatorStatisticsGateway: OperatorStatisticsGateway
): Promise<void> => {
  const statsStore = useStatsStore()
  statsStore.startLoadingOperatorStatistics()
  try {
    const report = await operatorStatisticsGateway.getOperatorStatistics(params)
    statsStore.setOperatorStatistics(report)
  } finally {
    statsStore.stopLoadingOperatorStatistics()
  }
}
