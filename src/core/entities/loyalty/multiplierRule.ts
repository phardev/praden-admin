import type { UUID } from '@core/types/types'

export interface MultiplierRule {
  uuid: UUID
  multiplier: number
  startDate: number
  endDate: number
  createdAt: string
  updatedAt: string
}
