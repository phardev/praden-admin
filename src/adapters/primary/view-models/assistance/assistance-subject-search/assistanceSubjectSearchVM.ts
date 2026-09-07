import { AssistanceSubjectType } from '@core/entities/assistanceRequest'
import type { Customer } from '@core/entities/customer'
import {
  getTotalWithTax,
  isAnonymousOrder,
  type Order
} from '@core/entities/order'
import type { Product } from '@core/entities/product'
import { useCustomerStore } from '@store/customerStore'
import { useSearchStore } from '@store/searchStore'
import { formatCurrency, timestampToLocaleString } from '@utils/formatters'

export interface SubjectOptionVM {
  uuid: string
  label: string
  secondaryLabel: string
  pageUrl: string
}

export interface AssistanceSubjectSearchVM {
  namespace: string
  results: Array<SubjectOptionVM>
  isLoading: boolean
  isQueryTooShort: boolean
  hasNoResults: boolean
}

export const MINIMUM_QUERY_LENGTH = 3

const NAMESPACES: Record<AssistanceSubjectType, string> = {
  [AssistanceSubjectType.ORDER]: 'assistance-subject-orders',
  [AssistanceSubjectType.PRODUCT]: 'assistance-subject-products',
  [AssistanceSubjectType.CUSTOMER]: 'assistance-subject-customers'
}

export const assistanceSubjectNamespace = (
  subjectType: AssistanceSubjectType
): string => NAMESPACES[subjectType]

const orderEmail = (order: Order): string | undefined =>
  isAnonymousOrder(order)
    ? order.contact.email
    : useCustomerStore().getByUuid(order.customerUuid)?.email

const orderSecondaryLabel = (order: Order): string =>
  [
    orderEmail(order),
    timestampToLocaleString(order.createdAt, 'fr-FR'),
    formatCurrency(getTotalWithTax(order))
  ]
    .filter((part) => !!part)
    .join(' · ')

const orderOption = (order: Order): SubjectOptionVM => ({
  uuid: order.uuid,
  label: `${order.deliveryAddress.firstname} ${order.deliveryAddress.lastname}`,
  secondaryLabel: orderSecondaryLabel(order),
  pageUrl: `/orders/${order.uuid}`
})

const productOption = (product: Product): SubjectOptionVM => ({
  uuid: product.uuid,
  label: product.name,
  secondaryLabel: product.ean13,
  pageUrl: `/products/get/${product.uuid}`
})

const customerOption = (customer: Customer): SubjectOptionVM => ({
  uuid: customer.uuid,
  label: `${customer.firstname} ${customer.lastname}`,
  secondaryLabel: customer.email,
  pageUrl: `/customers/get/${customer.uuid}`
})

const MAPPERS: Record<AssistanceSubjectType, (item: any) => SubjectOptionVM> = {
  [AssistanceSubjectType.ORDER]: orderOption,
  [AssistanceSubjectType.PRODUCT]: productOption,
  [AssistanceSubjectType.CUSTOMER]: customerOption
}

export const assistanceSubjectSearchVM = (
  subjectType: AssistanceSubjectType,
  query: string
): AssistanceSubjectSearchVM => {
  const searchStore = useSearchStore()
  const namespace = assistanceSubjectNamespace(subjectType)
  const filterMatches = searchStore.getFilter(namespace)?.query === query
  const isLoading = searchStore.isLoading(namespace)
  const results = filterMatches
    ? (searchStore.get(namespace) ?? []).map(MAPPERS[subjectType])
    : []
  return {
    namespace,
    results,
    isLoading,
    isQueryTooShort: !!searchStore.getError(namespace),
    hasNoResults:
      query.length >= MINIMUM_QUERY_LENGTH &&
      !isLoading &&
      filterMatches &&
      results.length === 0
  }
}
