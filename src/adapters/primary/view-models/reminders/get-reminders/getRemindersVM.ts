import { useStatsStore } from '@store/statsStore'

export interface RemindersVM {
  paymentReminders: {
    messagesSentCount: number
    orderCreatedCount: number
    conversionRate: number
  }
}

export const getRemindersVM = (): RemindersVM => {
  const statsStore = useStatsStore()
  const reminders = statsStore.reminders

  if (!reminders) {
    return {
      paymentReminders: {
        messagesSentCount: 0,
        orderCreatedCount: 0,
        conversionRate: 0
      }
    }
  }
  const { messagesSentCount, orderCreatedCount } = reminders.paymentReminders
  const conversionRate =
    messagesSentCount === 0
      ? 0
      : Math.round((orderCreatedCount / messagesSentCount) * 100)
  return {
    paymentReminders: {
      ...reminders.paymentReminders,
      conversionRate
    }
  }
}
