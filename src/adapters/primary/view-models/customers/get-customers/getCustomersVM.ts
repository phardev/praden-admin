import { UUID } from '@core/types/types'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useCustomerStore } from '@store/customerStore'
import { Customer } from '@core/entities/customer'

const headers: Array<Header> = [
  {
    name: 'Prénom',
    value: 'firstname'
  },
  {
    name: 'Nom',
    value: 'lastname'
  },
  {
    name: 'E-mail',
    value: 'email'
  },
  {
    name: 'Téléphone',
    value: 'phone'
  }
]

export interface GetCustomersItemVM {
  uuid: UUID
  firstname: string
  lastname: string
  email: string
  phone: string
}

export interface GetCustomersVM {
  headers: Array<Header>
  items: Array<GetCustomersItemVM>
}

export const getCustomersVM = (): GetCustomersVM => {
  const customerStore = useCustomerStore()
  const customers = customerStore.items
  return {
    headers,
    items: customers.map((customer: Customer) => ({
      uuid: customer.uuid,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone
    }))
  }
}
