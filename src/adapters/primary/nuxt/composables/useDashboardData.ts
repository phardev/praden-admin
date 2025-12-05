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
    isLoading.value = true
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const paramsWithTimezone = {
        ...params,
        timezone
      }
      await getDashboard(paramsWithTimezone, useDashboardGateway())
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
