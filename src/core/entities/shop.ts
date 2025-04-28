import { Address, Contact } from './order'
import { UUID } from '@core/types/types'

export interface Shop {
  uuid: UUID
  name: string
  contact: Contact
  address: Address
}
