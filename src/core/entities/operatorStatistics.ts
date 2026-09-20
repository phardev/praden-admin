import type { UUID } from '@core/types/types'

export interface OperatorCounts {
  orders: number
  lines: number
  boxes: number
}

export interface OperatorDailyCounts extends OperatorCounts {
  day: string
}

export interface OperatorTotals extends OperatorCounts {
  activeDays: number
}

export interface OperatorStatisticsRole {
  uuid: UUID
  name: string
}

export interface OperatorStatistics {
  operatorUuid: UUID
  firstname?: string
  lastname?: string
  email: string
  role: OperatorStatisticsRole
  totals: OperatorTotals
  averagePerDay: OperatorCounts
  daily: Array<OperatorDailyCounts>
}

export interface TeamStatistics {
  totals: OperatorTotals
  averagePerDay: OperatorCounts
  daily: Array<OperatorDailyCounts>
}

export interface OperatorStatisticsPeriod {
  startDate: string
  endDate: string
  timezone: string
  dataAvailableFrom: string
}

export interface OperatorStatisticsReport {
  period: OperatorStatisticsPeriod
  team: TeamStatistics
  operators: Array<OperatorStatistics>
  inactiveStaffCount: number
}
