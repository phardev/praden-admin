import type { UUID } from '@core/types/types'
import type { Permission } from '@core/entities/permission'

export interface Role {
  uuid: UUID
  name: string
  permissions: Array<Permission>
}
