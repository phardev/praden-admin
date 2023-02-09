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
