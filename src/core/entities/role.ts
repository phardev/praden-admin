import type { Permission } from '@core/entities/permission'
import type { UUID } from '@core/types/types'

export interface Role {
  uuid: UUID
  name: string
  permissions: Array<Permission>
  order: number
}

export const sortByOrder = (a: any, b: any): number => {
  return a.order - b.order
}
