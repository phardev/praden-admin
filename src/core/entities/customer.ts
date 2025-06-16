import { Mail, UUID } from '@core/types/types'

export interface Customer {
  uuid: UUID
  firstname: string
  lastname: string
  email: Mail
  phone: string
  ordersCount: number
  ordersTotal: number
}
