import { UUID } from '@core/types/types'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useCustomerStore } from '@store/customerStore'
import { Customer } from '@core/entities/customer'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { useSearchStore } from '@store/searchStore'

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
  isLoading: boolean
  currentSearch: SearchCustomersDTO | undefined
}

export const getCustomersVM = (key: string): GetCustomersVM => {
  const customerStore = useCustomerStore()
  const searchStore = useSearchStore()
  const customers = searchStore.get(key) || customerStore.items
  const currentSearch = searchStore.getFilter(key)
  return {
    headers,
    items: customers.map((customer: Customer) => ({
      uuid: customer.uuid,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone
    })),
    isLoading: false,
    currentSearch
  }
}
