import { Customer } from '@core/entities/customer'
import { UUID } from '@core/types/types'
import { CreateCustomerDTO } from '@core/usecases/customers/customer-creation/createCustomer'
import { EditCustomerDTO } from '@core/usecases/customers/customer-edition/editCustomer'

export interface CustomerGateway {
  list(limit: number, offset: number): Promise<Array<Customer>>
  getByUuid(uuid: UUID): Promise<Customer>
  create(dto: CreateCustomerDTO): Promise<Customer>
  edit(uuid: UUID, dto: EditCustomerDTO): Promise<Customer>
}
