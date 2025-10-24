import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Reminders } from '@core/entities/reminders'
import { RemindersGateway } from '@core/gateways/remindersGateway'

export class RealRemindersGateway
  extends RealGateway
  implements RemindersGateway
{
  constructor(url: string) {
    super(url)
  }

  async getRemindersData(): Promise<Reminders> {
    try {
      const response = await axiosWithBearer.get(`${this.baseUrl}/reminders`)
      return response.data
    } catch (error) {
      console.error('Error fetching reminders data:', error)
      throw error
    }
  }
}
