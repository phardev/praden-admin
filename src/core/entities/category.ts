import type { UUID } from '@core/types/types'

export interface Category {
  uuid: UUID
  name: string
  description: string
  parentUuid: UUID | undefined
}

export const isCategory = (object: any): object is Category => {
  return 'uuid' in object && 'name' in object
}
