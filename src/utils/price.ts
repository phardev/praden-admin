export const addTaxToPrice = (
  priceWithoutTax: number,
  taxRate: number
): number => {
  return priceWithoutTax + (priceWithoutTax * taxRate) / 100
}

export const removeTaxFromPrice = (
  priceWithTax: number,
  taxRate: number
): number => {
  return priceWithTax / (1 + taxRate / 100)
}
