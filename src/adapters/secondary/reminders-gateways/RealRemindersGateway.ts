import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { RemindersGateway } from '@core/gateways/remindersGateway'
import { Reminders } from '@core/entities/reminders'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

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
