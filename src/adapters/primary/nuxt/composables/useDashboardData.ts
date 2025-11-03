import { getDashboardVM } from '@adapters/primary/view-models/dashboard/get-dashboard/getDashboardVM'
import { DashboardParams } from '@core/gateways/dashboardGateway'
import { getDashboard } from '@core/usecases/dashboard/get-dashboard/getDashboard'
import { useDashboardGateway } from '../../../../../gateways/dashBoardGateway'

export const useDashboardData = () => {
  const isLoading = ref(false)

  const dashboard = computed(() => {
    return getDashboardVM()
  })

  const fetchDashboardData = async (
    params: DashboardParams = { productLimit: 50 }
  ) => {
    console.log('[useDashboardData] Starting fetch with params:', params)
    isLoading.value = true
    try {
      await getDashboard(params, useDashboardGateway())
      console.log('[useDashboardData] Fetch completed successfully')
      console.log(
        '[useDashboardData] Dashboard value after fetch:',
        dashboard.value
      )
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    dashboard,
    fetchDashboardData
  }
}
