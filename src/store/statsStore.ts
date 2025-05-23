import { defineStore } from 'pinia'
import { Dashboard } from '@core/entities/dashboard'

export const useStatsStore = defineStore('StatsStore', {
  state: () => {
    return {
      dashboard: undefined as Dashboard | undefined
    }
  },
  actions: {
    setDashboard(dashboard: Dashboard) {
      this.dashboard = JSON.parse(JSON.stringify(dashboard))
    }
  }
})
