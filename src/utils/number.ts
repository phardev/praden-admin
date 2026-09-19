export const parseDecimal = (value: unknown): number => {
  if (value === undefined || value === null) return 0
  const normalized = String(value)
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(normalized)
  return Number.isNaN(parsed) ? 0 : parsed
}
