import { UUID } from '@core/types/types'

export interface Laboratory {
  uuid: UUID
  name: string
  description: string
  miniature?: string
  image?: string
}
