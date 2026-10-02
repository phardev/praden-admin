import { timestampToLocaleString } from '@utils/formatters'

export interface ActiveFilterVM {
  key: string
  index?: number
  label: string
}

export interface CustomerPeriodFilters {
  customerQuery?: string
  startDate?: number
  endDate?: number
}

export const customerPeriodActiveFilters = (
  filters: CustomerPeriodFilters
): Array<ActiveFilterVM> => [
  ...(filters.customerQuery
    ? [{ key: 'customerQuery', label: `Client : "${filters.customerQuery}"` }]
    : []),
  ...(filters.startDate
    ? [
        {
          key: 'startDate',
          label: `Depuis le ${timestampToLocaleString(filters.startDate, 'fr-FR')}`
        }
      ]
    : []),
  ...(filters.endDate
    ? [
        {
          key: 'endDate',
          label: `Jusqu'au ${timestampToLocaleString(filters.endDate, 'fr-FR')}`
        }
      ]
    : [])
]
