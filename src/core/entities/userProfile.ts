import type { Role } from '@core/entities/role'
import type { UUID } from '@core/types/types'

export interface UserProfile {
  uuid: UUID
  email: string
  role: Role
}
