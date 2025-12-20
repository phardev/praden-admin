import { Customer } from '@core/entities/customer'
import { CustomerDoesNotExistsError } from '@core/errors/CustomerDoesNotExistsError'
import { CustomerGateway } from '@core/gateways/customerGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateCustomerDTO } from '@core/usecases/customers/customer-creation/createCustomer'
import { EditCustomerDTO } from '@core/usecases/customers/customer-edition/editCustomer'

export class InMemoryCustomerGateway implements CustomerGateway {
  private customers: Array<Customer> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(limit: number, offset: number): Promise<Array<Customer>> {
    const res = this.customers.slice(offset, offset + limit)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  getByUuid(uuid: UUID): Promise<Customer> {
    const res = this.customers.find((c) => c.uuid === uuid)
    if (!res) throw new CustomerDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  create(dto: CreateCustomerDTO): Promise<Customer> {
    const customer: Customer = {
      ...dto,
      uuid: this.uuidGenerator.generate(),
      ordersCount: 0,
      ordersTotal: 0
    }
    this.customers.push(customer)
    return Promise.resolve(customer)
  }

  edit(uuid: UUID, dto: EditCustomerDTO): Promise<Customer> {
    const index = this.customers.findIndex((c) => c.uuid === uuid)
    if (index < 0) throw new CustomerDoesNotExistsError(uuid)
    this.customers[index] = Object.assign(this.customers[index], dto)
    return Promise.resolve(this.customers[index])
  }

  feedWith(...customers: Array<Customer>): void {
    this.customers = customers
  }
}
