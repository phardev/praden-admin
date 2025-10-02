import type { UUID } from '@core/types/types'
import type { Role } from '@core/entities/role'

export interface UserProfile {
  uuid: UUID
  email: string
  role: Role
}
