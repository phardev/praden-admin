import type { LoyaltySettings } from '@core/entities/loyaltySettings'
import type { LoyaltySettingsGateway } from '@core/gateways/loyaltySettingsGateway'
import type { UUID } from '@core/types/types'

export class InMemoryLoyaltySettingsGateway implements LoyaltySettingsGateway {
  private settings: LoyaltySettings | null = null

  get(): Promise<LoyaltySettings | null> {
    return Promise.resolve(
      this.settings ? JSON.parse(JSON.stringify(this.settings)) : null
    )
  }

  update(uuid: UUID, pointsRatio: number): Promise<LoyaltySettings> {
    if (!this.settings) {
      this.settings = { uuid, pointsRatio }
    } else {
      this.settings = { ...this.settings, uuid, pointsRatio }
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.settings)))
  }

  feedWith(settings: LoyaltySettings) {
    this.settings = JSON.parse(JSON.stringify(settings))
  }
}
