import { Dashboard } from '@core/entities/dashboard'

export interface DashboardParams {
  productLimit?: number
  startDate?: Date
  endDate?: Date
  laboratoryUuid?: string
  categoryUuid?: string
  promotionOnly?: boolean
  timezone?: string
}

export interface DashboardGateway {
  getDashboardData(params: DashboardParams): Promise<Dashboard>
}
