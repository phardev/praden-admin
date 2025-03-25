export const priceFormatter = (
  locale: string,
  currency: string,
  minimumFractionDigits = 2
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits
  })
}

export const timestampToLocaleString = (
  timestamp: number,
  locale: string,
  options: any = { year: 'numeric', month: 'short', day: 'numeric' }
) => {
  const date = new Date(timestamp)
  return date.toLocaleString(locale, options)
}

export const percentFormatter = (n: number) => {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(n / 100)
}

export const formatCurrency = (value: number, includeSymbol = true): string => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return formatter.format(value)
}
