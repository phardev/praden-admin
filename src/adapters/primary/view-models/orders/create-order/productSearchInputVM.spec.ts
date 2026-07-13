import type { ProductSearchInput } from './productSearchInputVM'
import { parseProductSearchInput } from './productSearchInputVM'

describe('Product search input VM', () => {
  describe('The input is a GS1 datamatrix code', () => {
    it('should extract the ean13 and detect a scan', () => {
      const expectedInput: ProductSearchInput = {
        type: 'scan',
        ean13: '3400934567896'
      }
      expect(
        parseProductSearchInput('0103400934567896172601011021ABC123')
      ).toStrictEqual(expectedInput)
    })
  })

  describe('The input is a plain ean13', () => {
    it('should detect a scan with the ean13', () => {
      const expectedInput: ProductSearchInput = {
        type: 'scan',
        ean13: '3400934567896'
      }
      expect(parseProductSearchInput('3400934567896')).toStrictEqual(
        expectedInput
      )
    })
  })

  describe('The input is an ean13 surrounded by whitespace', () => {
    it('should trim the input and detect a scan', () => {
      const expectedInput: ProductSearchInput = {
        type: 'scan',
        ean13: '3400934567896'
      }
      expect(parseProductSearchInput(' 3400934567896 ')).toStrictEqual(
        expectedInput
      )
    })
  })

  describe('The input is a product name', () => {
    it('should detect a text query', () => {
      const expectedInput: ProductSearchInput = { type: 'query' }
      expect(parseProductSearchInput('doliprane')).toStrictEqual(expectedInput)
    })
  })

  describe('The input is a long text without GS1 code', () => {
    it('should detect a text query', () => {
      const expectedInput: ProductSearchInput = { type: 'query' }
      expect(
        parseProductSearchInput('doliprane 1000mg comprimés')
      ).toStrictEqual(expectedInput)
    })
  })

  describe('The input is a partial ean', () => {
    it('should detect a text query', () => {
      const expectedInput: ProductSearchInput = { type: 'query' }
      expect(parseProductSearchInput('34009345')).toStrictEqual(expectedInput)
    })
  })
})
