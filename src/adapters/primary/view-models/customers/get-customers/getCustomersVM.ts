import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { ActiveFilterVM } from '@adapters/primary/view-models/shared/filters'
import { Customer } from '@core/entities/customer'
import { UUID } from '@core/types/types'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { useCustomerStore } from '@store/customerStore'
import { useSearchStore } from '@store/searchStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'

const formatLastOrderDate = (date: Date | string | undefined): string => {
  if (!date) {
    return '-'
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

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
  },
  {
    name: 'Date dernière commande',
    value: 'lastOrderDate'
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
  lastOrderDate: string
}

export interface GetCustomersVM {
  headers: Array<Header>
  items: Array<GetCustomersItemVM>
  isLoading: boolean
  hasMore: boolean
  hasMoreSearch: boolean
  isSearchLoading: boolean
  activeFilters: Array<ActiveFilterVM>
  currentSearch: SearchCustomersDTO | undefined
  searchError: string | undefined
}

const buildActiveFilters = (
  filter: SearchCustomersDTO | undefined
): Array<ActiveFilterVM> => {
  if (!filter) return []
  const activeFilters: Array<ActiveFilterVM> = []
  if (filter.query) {
    activeFilters.push({ key: 'query', label: `Recherche : "${filter.query}"` })
  }
  if (filter.lastOrderStartDate !== undefined) {
    activeFilters.push({
      key: 'lastOrderStartDate',
      label: `Dernière commande depuis le ${timestampToLocaleString(filter.lastOrderStartDate, 'fr-FR')}`
    })
  }
  if (filter.lastOrderEndDate !== undefined) {
    activeFilters.push({
      key: 'lastOrderEndDate',
      label: `Dernière commande jusqu'au ${timestampToLocaleString(filter.lastOrderEndDate, 'fr-FR')}`
    })
  }
  if (filter.minOrdersCount !== undefined) {
    activeFilters.push({
      key: 'minOrdersCount',
      label: `Commandes ≥ ${filter.minOrdersCount}`
    })
  }
  if (filter.maxOrdersCount !== undefined) {
    activeFilters.push({
      key: 'maxOrdersCount',
      label: `Commandes ≤ ${filter.maxOrdersCount}`
    })
  }
  if (filter.newsletterSubscribed !== undefined) {
    activeFilters.push({
      key: 'newsletterSubscribed',
      label: filter.newsletterSubscribed
        ? 'Newsletter : abonnés'
        : 'Newsletter : non abonnés'
    })
  }
  return activeFilters
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
      ordersTotal: formatter.format(customer.ordersTotal / 100),
      lastOrderDate: formatLastOrderDate(customer.lastOrderDate)
    })),
    isLoading: false,
    hasMore: customerStore.hasMore,
    hasMoreSearch: searchStore.hasMoreSearch(key),
    isSearchLoading: searchStore.isLoading(key),
    activeFilters: buildActiveFilters(currentSearch),
    currentSearch,
    searchError: searchError
      ? 'Veuillez saisir au moins 3 caractères pour lancer la recherche.'
      : undefined
  }
}
