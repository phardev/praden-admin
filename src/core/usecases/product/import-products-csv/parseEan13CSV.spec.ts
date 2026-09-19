import { parseEan13CSV } from './parseEan13CSV'

describe('Parse EAN13 CSV', () => {
  it('should parse semicolon-delimited CSV with header', () => {
    const csv = 'Code13;Name\n3401234567890;Produit A'
    expect(parseEan13CSV(csv)).toStrictEqual(['3401234567890'])
  })

  it('should parse comma-delimited CSV', () => {
    const csv = 'Code13,Name\n3401234567890,Produit A'
    expect(parseEan13CSV(csv)).toStrictEqual(['3401234567890'])
  })

  it('should handle quoted values', () => {
    const csv = 'Code13;Name\n"3401234567890";"Produit A"'
    expect(parseEan13CSV(csv)).toStrictEqual(['3401234567890'])
  })

  it('should trim whitespace', () => {
    const csv = 'Code13;Name\n  3401234567890  ;Produit A'
    expect(parseEan13CSV(csv)).toStrictEqual(['3401234567890'])
  })

  it('should skip empty lines', () => {
    const csv = 'Code13\n\n3401234567890\n\n'
    expect(parseEan13CSV(csv)).toStrictEqual(['3401234567890'])
  })

  it('should deduplicate EAN13 codes', () => {
    const csv = 'Code13\n3401234567890\n3401234567890'
    expect(parseEan13CSV(csv)).toStrictEqual(['3401234567890'])
  })

  it('should handle short codes (7 digits)', () => {
    const csv = 'Code13\n1234567'
    expect(parseEan13CSV(csv)).toStrictEqual(['1234567'])
  })

  it('should skip non-numeric values', () => {
    const csv = 'Code13\nabc\n1234567890123'
    expect(parseEan13CSV(csv)).toStrictEqual(['1234567890123'])
  })

  it('should handle BOM character', () => {
    const csv = '\uFEFFCode13\n3401234567890'
    expect(parseEan13CSV(csv)).toStrictEqual(['3401234567890'])
  })

  it('should return empty array for header-only CSV', () => {
    const csv = 'Code13'
    expect(parseEan13CSV(csv)).toStrictEqual([])
  })
})
