import { Dashboard } from '@core/entities/dashboard'

export interface DashboardParams {
  productLimit?: number
  startDate?: Date
  endDate?: Date
}

export interface DashboardGateway {
  getDashboardData(params: DashboardParams): Promise<Dashboard>
}
