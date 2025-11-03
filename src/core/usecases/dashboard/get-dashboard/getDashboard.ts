import {
  DashboardGateway,
  DashboardParams
} from '@core/gateways/dashboardGateway'
import { useStatsStore } from '@store/statsStore'

export const getDashboard = async (
  params: DashboardParams,
  dashboardGateway: DashboardGateway
): Promise<void> => {
  console.log('[getDashboard] Fetching dashboard data with params:', params)
  const dashboard = await dashboardGateway.getDashboardData(params)
  console.log('[getDashboard] Received dashboard data:', dashboard)
  console.log('[getDashboard] totalSales detail:', dashboard.totalSales)
  const statsStore = useStatsStore()
  console.log('[getDashboard] Stats store before set:', statsStore.dashboard)
  statsStore.setDashboard(dashboard)
  console.log('[getDashboard] Stats store after set:', statsStore.dashboard)
  console.log(
    '[getDashboard] Stats store totalSales after set:',
    statsStore.dashboard?.totalSales
  )
}
