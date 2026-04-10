export const parsePromotionCSV = (csvContent: string): Array<string> => {
  const content = csvContent.replace(/^\uFEFF/, '')
  const lines = content.split(/\r?\n/)
  const dataLines = lines.slice(1)
  const ean13s: Array<string> = []

  for (const line of dataLines) {
    const value = line.split(/[;,]/)[0]?.replace(/"/g, '').trim()
    if (value && /^\d+$/.test(value)) {
      ean13s.push(value)
    }
  }

  return [...new Set(ean13s)]
}
