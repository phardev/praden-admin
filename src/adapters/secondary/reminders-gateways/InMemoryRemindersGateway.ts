import { Reminders } from '@core/entities/reminders'
import { RemindersGateway } from '@core/gateways/remindersGateway'

export class InMemoryRemindersGateway implements RemindersGateway {
  private mockData: Reminders

  constructor() {
    this.mockData = {
      paymentReminders: {
        messagesSentCount: 9,
        orderCreatedCount: 6
      }
    }
  }

  async getRemindersData(): Promise<Reminders> {
    return this.mockData
  }

  setMockData(data: Reminders): void {
    this.mockData = data
  }
}
