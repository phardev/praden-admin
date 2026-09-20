import { Dashboard } from '@core/entities/dashboard'
import { OperatorStatisticsReport } from '@core/entities/operatorStatistics'
import { Reminders } from '@core/entities/reminders'
import { defineStore } from 'pinia'

export type OperatorMetric = 'orders' | 'lines' | 'boxes'

export const useStatsStore = defineStore('StatsStore', {
  state: () => {
    return {
      dashboard: undefined as Dashboard | undefined,
      reminders: undefined as Reminders | undefined,
      operatorStatistics: undefined as OperatorStatisticsReport | undefined,
      isLoadingOperatorStatistics: false,
      selectedOperatorUuid: undefined as string | undefined,
      selectedMetric: 'orders' as OperatorMetric
    }
  },
  actions: {
    setDashboard(dashboard: Dashboard) {
      this.dashboard = JSON.parse(JSON.stringify(dashboard))
    },
    setReminders(reminders: Reminders) {
      this.reminders = JSON.parse(JSON.stringify(reminders))
    },
    setOperatorStatistics(report: OperatorStatisticsReport) {
      this.operatorStatistics = JSON.parse(JSON.stringify(report))
    },
    startLoadingOperatorStatistics() {
      this.isLoadingOperatorStatistics = true
    },
    stopLoadingOperatorStatistics() {
      this.isLoadingOperatorStatistics = false
    },
    selectOperator(operatorUuid: string | undefined) {
      this.selectedOperatorUuid = operatorUuid
    },
    selectMetric(metric: OperatorMetric) {
      this.selectedMetric = metric
    }
  }
})
