import { UUID } from '../types/types'

export interface Category {
  uuid: UUID
  name: string
}

export const isCategory = (object: any): object is Category => {
  return 'uuid' in object && 'name' in object
}
