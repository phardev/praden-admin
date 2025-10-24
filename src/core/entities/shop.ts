import { UUID } from '@core/types/types'
import { Address, Contact } from './order'

export interface Shop {
  uuid: UUID
  name: string
  contact: Contact
  address: Address
}
