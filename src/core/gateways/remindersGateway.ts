import { Reminders } from '@core/entities/reminders'

export interface RemindersGateway {
  getRemindersData(): Promise<Reminders>
}
