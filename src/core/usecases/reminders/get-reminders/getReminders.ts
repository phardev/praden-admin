import { RemindersGateway } from '@core/gateways/remindersGateway'
import { useStatsStore } from '@store/statsStore'

export const getReminders = async (
  remindersGateway: RemindersGateway
): Promise<void> => {
  const reminders = await remindersGateway.getRemindersData()
  const statsStore = useStatsStore()
  statsStore.setReminders(reminders)
}
