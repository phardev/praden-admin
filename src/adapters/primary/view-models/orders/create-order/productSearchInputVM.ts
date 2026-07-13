const EAN13_LENGTH = 13
const EAN13_FORMAT = /^\d{13}$/
const GS1_EAN13_FORMAT = /010(\d{13})/

export type ProductSearchInput =
  | { type: 'scan'; ean13: string }
  | { type: 'query' }

export const parseProductSearchInput = (value: string): ProductSearchInput => {
  const trimmed = value.trim()
  if (trimmed.length > EAN13_LENGTH) {
    const gs1Match = trimmed.match(GS1_EAN13_FORMAT)
    if (gs1Match) {
      return { type: 'scan', ean13: gs1Match[1] }
    }
  }
  if (EAN13_FORMAT.test(trimmed)) {
    return { type: 'scan', ean13: trimmed }
  }
  return { type: 'query' }
}
