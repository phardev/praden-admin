import type { UUID } from '@core/types/types'
import { Role } from './role'

export interface Staff {
  uuid: UUID
  firstname: string
  lastname: string
  email: string
  role: Role
}
