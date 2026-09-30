import { useStatsStore } from '@store/statsStore'

export interface RemindersVM {
  paymentReminders: {
    messagesSentCount: number
    orderCreatedCount: number
    conversionRate: number
  }
  abandonedCartReminders: {
    remindedCartsCount: number
    orderedCartsCount: number
    conversionRate: number
  }
}

const conversionRateOf = (sent: number, converted: number): number =>
  sent === 0 ? 0 : Math.round((converted / sent) * 100)

export const getRemindersVM = (): RemindersVM => {
  const statsStore = useStatsStore()
  const reminders = statsStore.reminders

  if (!reminders) {
    return {
      paymentReminders: {
        messagesSentCount: 0,
        orderCreatedCount: 0,
        conversionRate: 0
      },
      abandonedCartReminders: {
        remindedCartsCount: 0,
        orderedCartsCount: 0,
        conversionRate: 0
      }
    }
  }
  const { messagesSentCount, orderCreatedCount } = reminders.paymentReminders
  const { remindedCartsCount, orderedCartsCount } =
    reminders.abandonedCartReminders
  return {
    paymentReminders: {
      ...reminders.paymentReminders,
      conversionRate: conversionRateOf(messagesSentCount, orderCreatedCount)
    },
    abandonedCartReminders: {
      ...reminders.abandonedCartReminders,
      conversionRate: conversionRateOf(remindedCartsCount, orderedCartsCount)
    }
  }
}
