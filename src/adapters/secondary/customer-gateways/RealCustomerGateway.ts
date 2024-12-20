import { Customer } from '@core/entities/customer'
import { CustomerGateway } from '@core/gateways/customerGateway'
import { UUID } from '@core/types/types'
import { CreateCustomerDTO } from '@core/usecases/customers/customer-creation/createCustomer'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { EditCustomerDTO } from '@core/usecases/customers/customer-edition/editCustomer'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealCustomerGateway
  extends RealGateway
  implements CustomerGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Customer>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/customers/`)
    return res.data
  }

  async getByUuid(uuid: UUID): Promise<Customer> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/customers/${uuid}`)
    return res.data
  }
  async create(dto: CreateCustomerDTO): Promise<Customer> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/customers`, dto)
    return res.data
  }

  async edit(uuid: UUID, dto: EditCustomerDTO): Promise<Customer> {
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/customers/${uuid}`,
      dto
    )
    return res.data
  }
}
