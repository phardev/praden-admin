import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import type { LoyaltySettings } from '@core/entities/loyaltySettings'
import type { LoyaltySettingsGateway } from '@core/gateways/loyaltySettingsGateway'
import type { UUID } from '@core/types/types'

export class RealLoyaltySettingsGateway
  extends RealGateway
  implements LoyaltySettingsGateway
{
  constructor(url: string) {
    super(url)
  }

  async get(): Promise<LoyaltySettings | null> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/loyalty-settings/`)
    const item = res.data.item
    if (!item) {
      return null
    }
    return {
      uuid: item.uuid,
      pointsRatio: item.pointsRatio
    }
  }

  async update(uuid: UUID, pointsRatio: number): Promise<LoyaltySettings> {
    await axiosWithBearer.put(`${this.baseUrl}/loyalty-settings/${uuid}`, {
      pointsRatio
    })
    return {
      uuid,
      pointsRatio
    }
  }
}
