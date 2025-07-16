import { RemindersGateway } from '@core/gateways/remindersGateway'
import { Reminders } from '@core/entities/reminders'

export class InMemoryRemindersGateway implements RemindersGateway {
  private mockData: Reminders

  constructor() {
    this.mockData = {
      paymentReminders: {
        messagesSentCount: 0,
        orderCreatedCount: 0
      }
    }
  }

  async getRemindersData(): Promise<Reminders> {
    return this.mockData
  }

  feedWith(mockData: Reminders) {
    this.mockData = mockData
  }
}
