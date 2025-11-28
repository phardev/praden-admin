import {
  createExistingImage,
  createNewImage,
  getDisplayUrl,
  isExistingImage,
  isNewImage
} from '@core/entities/productImage'

describe('ProductImage entity', () => {
  describe('createExistingImage', () => {
    it('should create ProductImage with existing source', () => {
      const result = createExistingImage(
        'https://example.com/image.jpg',
        'uuid-1',
        0
      )

      expect(result).toStrictEqual({
        id: 'uuid-1',
        source: { type: 'existing', url: 'https://example.com/image.jpg' },
        order: 0
      })
    })
  })

  describe('createNewImage', () => {
    it('should create ProductImage with new source', () => {
      const file = new File(['data'], 'test.png', { type: 'image/png' })
      const result = createNewImage(
        file,
        'uuid-2',
        1,
        'data:image/png;base64,ZGF0YQ=='
      )

      expect(result).toStrictEqual({
        id: 'uuid-2',
        source: {
          type: 'new',
          file,
          previewUrl: 'data:image/png;base64,ZGF0YQ=='
        },
        order: 1
      })
    })
  })

  describe('getDisplayUrl', () => {
    it('should return url for existing image', () => {
      const image = createExistingImage(
        'https://example.com/image.jpg',
        'uuid-1',
        0
      )

      expect(getDisplayUrl(image)).toBe('https://example.com/image.jpg')
    })

    it('should return previewUrl for new image', () => {
      const file = new File(['data'], 'test.png', { type: 'image/png' })
      const image = createNewImage(
        file,
        'uuid-2',
        1,
        'data:image/png;base64,ZGF0YQ=='
      )

      expect(getDisplayUrl(image)).toBe('data:image/png;base64,ZGF0YQ==')
    })
  })

  describe('isExistingImage', () => {
    it('should return true for existing image', () => {
      const image = createExistingImage(
        'https://example.com/image.jpg',
        'uuid-1',
        0
      )

      expect(isExistingImage(image)).toBe(true)
    })

    it('should return false for new image', () => {
      const file = new File(['data'], 'test.png', { type: 'image/png' })
      const image = createNewImage(
        file,
        'uuid-2',
        1,
        'data:image/png;base64,ZGF0YQ=='
      )

      expect(isExistingImage(image)).toBe(false)
    })
  })

  describe('isNewImage', () => {
    it('should return true for new image', () => {
      const file = new File(['data'], 'test.png', { type: 'image/png' })
      const image = createNewImage(
        file,
        'uuid-2',
        1,
        'data:image/png;base64,ZGF0YQ=='
      )

      expect(isNewImage(image)).toBe(true)
    })

    it('should return false for existing image', () => {
      const image = createExistingImage(
        'https://example.com/image.jpg',
        'uuid-1',
        0
      )

      expect(isNewImage(image)).toBe(false)
    })
  })
})
