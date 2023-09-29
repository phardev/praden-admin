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

export type CreatePromotionDTO = Omit<Promotion, 'uuid'>
export type EditPromotionDTO = Partial<CreatePromotionDTO>

export const isPromotionStarted = (p: Promotion, now: Timestamp): boolean => {
  return !p.startDate ? true : p.startDate < now
}

export const isPromotionEnded = (p: Promotion, now: Timestamp): boolean => {
  return !p.endDate ? false : now > p.endDate
}

export const isPromotionInProgress = (
  p: Promotion,
  now: Timestamp
): boolean => {
  return isPromotionStarted(p, now) && !isPromotionEnded(p, now)
}
