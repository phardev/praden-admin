import {
  DashboardGateway,
  DashboardParams
} from '@core/gateways/dashboardGateway'
import { useStatsStore } from '@store/statsStore'

export const getDashboard = async (
  params: DashboardParams,
  dashboardGateway: DashboardGateway
): Promise<void> => {
  const dashboard = await dashboardGateway.getDashboardData(params)
  const statsStore = useStatsStore()
  statsStore.setDashboard(dashboard)
}
