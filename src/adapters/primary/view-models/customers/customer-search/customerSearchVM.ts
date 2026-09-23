import type { CustomerLoyalty } from '@core/entities/loyaltyPointsTransaction'
import type { UUID } from '@core/types/types'
import { useSearchStore } from '@store/searchStore'

export interface SearchableCustomer {
  uuid: UUID
  email: string
  firstname?: string
  lastname?: string
  phone?: string
  loyalty?: CustomerLoyalty
}

export interface CustomerSearchItemVM {
  uuid: UUID
  fullname: string
  contact: string
}

export interface SelectedCustomerVM {
  fullname: string
  contact: string
  loyaltyBalance?: number
}

export interface CustomerSearchVM {
  results: Array<CustomerSearchItemVM>
  selected?: SelectedCustomerVM
  isLoading: boolean
  hasError: boolean
  hasSearchedQuery: boolean
}

const fullnameOf = (customer: SearchableCustomer): string =>
  [customer.firstname, customer.lastname].filter(Boolean).join(' ')

const contactOf = (customer: SearchableCustomer): string =>
  [customer.email, customer.phone].filter(Boolean).join(' · ')

const toSelectedCustomerVM = (
  customer: SearchableCustomer
): SelectedCustomerVM => ({
  fullname: fullnameOf(customer),
  contact: contactOf(customer),
  ...(customer.loyalty && { loyaltyBalance: customer.loyalty.balance })
})

export const customerSearchVM = (
  namespace: string,
  selectedCustomer?: SearchableCustomer
): CustomerSearchVM => {
  const searchStore = useSearchStore()
  const results: Array<SearchableCustomer> = searchStore.get(namespace) || []
  const isLoading = searchStore.isLoading(namespace)
  const hasError = !!searchStore.getError(namespace)
  return {
    results: results.map((customer) => ({
      uuid: customer.uuid,
      fullname: fullnameOf(customer),
      contact: contactOf(customer)
    })),
    ...(selectedCustomer && {
      selected: toSelectedCustomerVM(selectedCustomer)
    }),
    isLoading,
    hasError,
    hasSearchedQuery:
      !!searchStore.getFilter(namespace)?.query && !hasError && !isLoading
  }
}
