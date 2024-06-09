import { UUID } from '@core/types/types'

import { Customer } from '@core/entities/customer'
import { CreateCustomerDTO } from '@core/usecases/customers/customer-creation/createCustomer'

export interface CustomerGateway {
  list(): Promise<Array<Customer>>
  getByUuid(uuid: UUID): Promise<Customer>
  create(dto: CreateCustomerDTO): Promise<Customer>
  edit(uuid: UUID, dto: EditCustomerDTO): Promise<Customer>
}
