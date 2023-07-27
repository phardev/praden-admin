import { Timestamp, UUID } from '@core/types/types'

export enum ReductionType {
  Fixed = 'FIXED',
  Percentage = 'PERCENTAGE'
}

export interface Promotion {
  uuid: UUID
  name: string
  products: Array<UUID>
  type: ReductionType
  amount: number
  startDate?: Timestamp
  endDate?: Timestamp
}
