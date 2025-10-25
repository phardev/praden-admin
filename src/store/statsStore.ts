import { Dashboard } from '@core/entities/dashboard'
import { Reminders } from '@core/entities/reminders'
import { defineStore } from 'pinia'

export const useStatsStore = defineStore('StatsStore', {
  state: () => {
    return {
      dashboard: undefined as Dashboard | undefined,
      reminders: undefined as Reminders | undefined
    }
  },
  actions: {
    setDashboard(dashboard: Dashboard) {
      this.dashboard = JSON.parse(JSON.stringify(dashboard))
    },
    setReminders(reminders: Reminders) {
      this.reminders = JSON.parse(JSON.stringify(reminders))
    }
  }
})
