import { Timestamp, UUID } from '@core/types/types'

export interface EmergencyPharmacy {
  uuid: UUID
  name: string
  address: string
  phone: string
  date: Timestamp
  isActive: boolean
}
