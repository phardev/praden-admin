import { getRemindersVM } from '../../view-models/reminders/get-reminders/getRemindersVM'
import { getReminders } from '@core/usecases/reminders/get-reminders/getReminders'
import { useRemindersGateway } from '../../../../../gateways/remindersGateway'

export const useRemindersData = () => {
  const isLoading = ref(false)
  const reminders = computed(() => getRemindersVM())

  const fetchRemindersData = async () => {
    isLoading.value = true
    try {
      await getReminders(useRemindersGateway())
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    reminders,
    fetchRemindersData
  }
}
