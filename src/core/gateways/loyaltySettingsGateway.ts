import type { LoyaltySettings } from '@core/entities/loyaltySettings'
import type { UUID } from '@core/types/types'

export interface LoyaltySettingsGateway {
  get(): Promise<LoyaltySettings | null>
  update(uuid: UUID, pointsRatio: number): Promise<LoyaltySettings>
}
