import { dolodent } from '@utils/testData/products'
import { ean13FilterOf, isIncompleteEan13 } from './filters'

describe('EAN13 filter', () => {
  const incompleteEan13 = dolodent.ean13.slice(0, 6)
  const pastedWithSpaces = ` ${dolodent.ean13.slice(0, 4)} ${dolodent.ean13.slice(4)} `

  it('should keep a complete EAN13 pasted with spaces', () => {
    expect(ean13FilterOf(pastedWithSpaces)).toStrictEqual(dolodent.ean13)
  })

  it('should not filter on an incomplete EAN13', () => {
    expect(ean13FilterOf(incompleteEan13)).toBeUndefined()
  })

  it('should flag an incomplete EAN13', () => {
    expect(isIncompleteEan13(incompleteEan13)).toBe(true)
  })

  it('should not flag an empty field', () => {
    expect(isIncompleteEan13('')).toBe(false)
  })

  it('should not flag a complete EAN13 pasted with spaces', () => {
    expect(isIncompleteEan13(pastedWithSpaces)).toBe(false)
  })
})
