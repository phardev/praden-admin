import { ReductionType } from '@core/entities/promotion'
import { Timestamp } from '@core/types/types'

export interface PromotionListItem {
  uuid: string
  name: string
  type: ReductionType
  amount: number
  startDate?: Timestamp
  endDate?: Timestamp
  productCount: number
}
