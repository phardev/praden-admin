import { getDashboard } from '@core/usecases/dashboard/get-dashboard/getDashboard'
import { getDashboardVM } from '@adapters/primary/view-models/dashboard/get-dashboard/getDashboardVM'
import { useDashboardGateway } from '../../../../../gateways/dashBoardGateway'
import { DashboardParams } from '@core/gateways/dashboardGateway'
import { getPermissionsVM } from '@adapters/primary/view-models/permissions/getPermissionsVM'

export const useDashboardData = () => {
  const isLoading = ref(false)

  const dashboard = computed(() => {
    return getDashboardVM()
  })

  const fetchDashboardData = async (
    params: DashboardParams = { productLimit: 50 }
  ) => {
    const permissions = getPermissionsVM()

    if (!permissions.canAccessDashboard) {
      return
    }

    isLoading.value = true
    try {
      await getDashboard(params, useDashboardGateway())
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
