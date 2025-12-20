export type ImageSource =
  | { type: 'existing'; url: string }
  | { type: 'new'; file: File; previewUrl: string }

export interface ProductImage {
  id: string
  source: ImageSource
  order: number
}

export const createExistingImage = (
  url: string,
  id: string,
  order: number
): ProductImage => ({
  id,
  source: { type: 'existing', url },
  order
})

export const createNewImage = (
  file: File,
  id: string,
  order: number,
  previewUrl: string
): ProductImage => ({
  id,
  source: { type: 'new', file, previewUrl },
  order
})

export const getDisplayUrl = (image: ProductImage): string =>
  image.source.type === 'existing' ? image.source.url : image.source.previewUrl

export const isExistingImage = (
  image: ProductImage
): image is ProductImage & { source: { type: 'existing'; url: string } } =>
  image.source.type === 'existing'

export const isNewImage = (
  image: ProductImage
): image is ProductImage & {
  source: { type: 'new'; file: File; previewUrl: string }
} => image.source.type === 'new'
