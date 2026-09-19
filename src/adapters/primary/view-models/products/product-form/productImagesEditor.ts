import type { ProductFormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import type { ProductFormFieldsReader } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import {
  createNewImage,
  getDisplayUrl,
  type ProductImage
} from '@core/entities/productImage'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import { getFileContent } from '@utils/file'

export class ProductImagesEditor {
  private readonly fieldsReader: ProductFormFieldsReader
  private readonly fieldsWriter: ProductFormFieldsWriter
  private readonly uuidGenerator: UuidGenerator

  constructor(
    fieldsReader: ProductFormFieldsReader,
    fieldsWriter: ProductFormFieldsWriter,
    uuidGenerator: UuidGenerator
  ) {
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
    this.uuidGenerator = uuidGenerator
  }

  async add(files: Array<File>): Promise<void> {
    const productImages = this.current()
    const startOrder = productImages.length
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const previewUrl = await getFileContent(file)
      productImages.push(
        createNewImage(
          file,
          this.uuidGenerator.generate(),
          startOrder + i,
          previewUrl
        )
      )
    }
    this.save(productImages)
  }

  removeById(imageId: string): void {
    this.save(this.current().filter((image) => image.id !== imageId))
  }

  reorder(fromIndex: number, toIndex: number): void {
    const productImages = [...this.current()]
    const [moved] = productImages.splice(fromIndex, 1)
    productImages.splice(toIndex, 0, moved)
    this.save(productImages)
  }

  ordered(): Array<ProductImage> {
    return [...this.current()].sort((a, b) => a.order - b.order)
  }

  forDisplay(): Array<{ id: string; url: string }> {
    return this.ordered().map((image) => ({
      id: image.id,
      url: getDisplayUrl(image)
    }))
  }

  private current(): Array<ProductImage> {
    return this.fieldsReader.get('productImages') || []
  }

  private save(productImages: Array<ProductImage>): void {
    productImages.forEach((image, index) => {
      image.order = index
    })
    this.fieldsWriter.set('productImages', productImages)
  }
}
