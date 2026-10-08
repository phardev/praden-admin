import { timestampToLocaleString } from '@utils/formatters'

const EAN13 = /^\d{13}$/

export interface ActiveFilterVM {
  key: string
  index?: number
  label: string
}

export interface CustomerPeriodFilters {
  customerQuery?: string
  ean13?: string
  startDate?: number
  endDate?: number
}

export const customerPeriodActiveFilters = (
  filters: CustomerPeriodFilters
): Array<ActiveFilterVM> => [
  ...(filters.customerQuery
    ? [{ key: 'customerQuery', label: `Client : "${filters.customerQuery}"` }]
    : []),
  ...(filters.ean13 ? [{ key: 'ean13', label: `EAN : ${filters.ean13}` }] : []),
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

const withoutSpaces = (input: string): string => input.replace(/\s/g, '')

export const ean13FilterOf = (input: string): string | undefined => {
  const ean13 = withoutSpaces(input)
  return EAN13.test(ean13) ? ean13 : undefined
}

export const isIncompleteEan13 = (input: string): boolean =>
  withoutSpaces(input) !== '' && !ean13FilterOf(input)
