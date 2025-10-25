import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Customer } from '@core/entities/customer'
import { UUID } from '@core/types/types'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { useCustomerStore } from '@store/customerStore'
import { useSearchStore } from '@store/searchStore'
import { priceFormatter } from '@utils/formatters'

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
  },
  {
    name: 'Abonnement newsletter',
    value: 'newsletterSubscription'
  },
  {
    name: 'Nombre de commandes',
    value: 'ordersCount'
  },
  {
    name: 'Total des commandes',
    value: 'ordersTotal'
  }
]

export interface GetCustomersItemVM {
  uuid: UUID
  firstname: string
  lastname: string
  email: string
  phone: string
  newsletterSubscription: boolean
  ordersCount: number
  ordersTotal: string
}

export interface GetCustomersVM {
  headers: Array<Header>
  items: Array<GetCustomersItemVM>
  isLoading: boolean
  hasMore: boolean
  currentSearch: SearchCustomersDTO | undefined
  searchError: string | undefined
}

export const getCustomersVM = (key: string): GetCustomersVM => {
  const customerStore = useCustomerStore()
  const searchStore = useSearchStore()
  const customers = searchStore.get(key) || customerStore.items
  const currentSearch = searchStore.getFilter(key)
  const formatter = priceFormatter('fr-FR', 'EUR')
  const searchError = searchStore.getError(key)
  return {
    headers,
    items: customers.map((customer: Customer) => ({
      uuid: customer.uuid,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      newsletterSubscription: !!customer.newsletterSubscription,
      ordersCount: customer.ordersCount,
      ordersTotal: formatter.format(customer.ordersTotal / 100)
    })),
    isLoading: false,
    hasMore: customerStore.hasMore,
    currentSearch,
    searchError: searchError
      ? 'Veuillez saisir au moins 3 caractères pour lancer la recherche.'
      : undefined
  }
}
