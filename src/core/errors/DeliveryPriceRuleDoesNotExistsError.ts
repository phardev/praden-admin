import type { UUID } from '@core/types/types'

export class DeliveryPriceRuleDoesNotExistsError extends Error {
  constructor(uuid: UUID) {
    super(`DeliveryPriceRule does not exists error: ${uuid}`)
  }
}
