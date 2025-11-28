import {
  CreateProductCategoriesVM,
  CreateProductLaboratoriesVM,
  CreateProductLocationsVM,
  ProductFormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  ExistingProductFormInitializer,
  GetProductPromotionVM,
  ProductFormFieldsReader,
  ProductFormVM
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { RealUuidGenerator } from '@adapters/secondary/uuid-generators/RealUuidGenerator'
import { ProductStatus } from '@core/entities/product'
import {
  createNewImage,
  getDisplayUrl,
  type ProductImage
} from '@core/entities/productImage'
import { ReductionType } from '@core/entities/promotion'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useProductStore } from '@store/productStore'
import { getFileContent } from '@utils/file'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'

export class ProductFormEditVM extends ProductFormVM {
  private fieldsReader: ProductFormFieldsReader
  private fieldsWriter: ProductFormFieldsWriter
  private uuidGenerator: UuidGenerator

  constructor(
    initializer: ExistingProductFormInitializer,
    fieldsReader: ProductFormFieldsReader,
    fieldsWriter: ProductFormFieldsWriter,
    uuidGenerator: UuidGenerator
  ) {
    super()
    initializer.init()
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
    this.uuidGenerator = uuidGenerator
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  toggleCategory(uuid: UUID): void {
    const categoryUuids = this.fieldsReader.get('categoryUuids')
    const index = categoryUuids.indexOf(uuid)
    if (index < 0) {
      categoryUuids.push(uuid)
    } else {
      categoryUuids.splice(index, 1)
    }
    this.fieldsWriter.set('categoryUuids', categoryUuids)
  }

  toggleIsActive(): void {
    const isActive = this.fieldsReader.get('isActive')
    this.fieldsWriter.set('isActive', !isActive)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  async set(fieldName: string, value: any): Promise<void> {
    await this.fieldsWriter.set(fieldName, value)
  }

  removeImageById(imageId: string): void {
    const productImages: Array<ProductImage> =
      this.fieldsReader.get('productImages')
    const filtered = productImages.filter((img) => img.id !== imageId)
    filtered.forEach((img, index) => {
      img.order = index
    })
    this.fieldsWriter.set('productImages', filtered)
  }

  reorderImages(fromIndex: number, toIndex: number): void {
    const productImages: Array<ProductImage> = [
      ...this.fieldsReader.get('productImages')
    ]
    const [moved] = productImages.splice(fromIndex, 1)
    productImages.splice(toIndex, 0, moved)
    productImages.forEach((img, index) => {
      img.order = index
    })
    this.fieldsWriter.set('productImages', productImages)
  }

  async addImages(files: Array<File>): Promise<void> {
    const productImages: Array<ProductImage> =
      this.fieldsReader.get('productImages')
    const startOrder = productImages.length
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const previewUrl = await getFileContent(file)
      const newImage = createNewImage(
        file,
        this.uuidGenerator.generate(),
        startOrder + i,
        previewUrl
      )
      productImages.push(newImage)
    }
    this.fieldsWriter.set('productImages', productImages)
  }

  getProductImagesForDisplay(): Array<{ id: string; url: string }> {
    const productImages: Array<ProductImage> =
      this.fieldsReader.get('productImages') || []
    return [...productImages]
      .sort((a, b) => a.order - b.order)
      .map((img) => ({
        id: img.id,
        url: getDisplayUrl(img)
      }))
  }

  getAvailableCategories(): CreateProductCategoriesVM {
    return this.fieldsReader.getAvailableCategories()
  }

  getAvailableLocations(): CreateProductLocationsVM {
    return this.fieldsReader.getAvailableLocations()
  }

  getAvailableLaboratories(): CreateProductLaboratoriesVM {
    return this.fieldsReader.getAvailableLaboratories()
  }

  getDto(): EditProductDTO {
    const priceWithoutTax = this.fieldsReader.get('priceWithoutTax')
      ? parseFloat(this.fieldsReader.get('priceWithoutTax')) * 100
      : undefined
    const percentTaxRate = this.fieldsReader.get('percentTaxRate')
      ? parseFloat(this.fieldsReader.get('percentTaxRate'))
      : undefined
    const availableStock = this.fieldsReader.get('availableStock')
      ? parseInt(this.fieldsReader.get('availableStock'))
      : undefined
    const laboratoryStore = useLaboratoryStore()
    const laboratory = laboratoryStore.getByUuid(
      this.fieldsReader.get('laboratory')
    )
    const productImages: Array<ProductImage> =
      this.fieldsReader.get('productImages') || []
    const orderedImages = [...productImages].sort((a, b) => a.order - b.order)
    return {
      name: this.fieldsReader.get('name'),
      status: this.fieldsReader.get('isActive')
        ? ProductStatus.Active
        : ProductStatus.Inactive,
      cip7: this.fieldsReader.get('cip7'),
      cip13: this.fieldsReader.get('cip13'),
      ean13: this.fieldsReader.get('ean13'),
      categoryUuids: this.fieldsReader.get('categoryUuids'),
      laboratory,
      miniature: this.fieldsReader.get('newMiniature'),
      orderedImages,
      priceWithoutTax,
      percentTaxRate,
      locations: this.fieldsReader.get('locations'),
      availableStock,
      description: this.fieldsReader.get('description'),
      instructionsForUse: this.fieldsReader.get('instructionsForUse'),
      composition: this.fieldsReader.get('composition'),
      weight: +this.fieldsReader.get('weight') * 1000,
      maxQuantityForOrder: this.fieldsReader.get('maxQuantityForOrder')
        ? +this.fieldsReader.get('maxQuantityForOrder')
        : undefined,
      flags: {
        arePromotionsAllowed: this.fieldsReader.get('arePromotionsAllowed')
      }
    }
  }

  getPromotion(): GetProductPromotionVM | undefined {
    const productStore = useProductStore()
    if (!productStore.current?.promotion) return undefined
    const promotion = productStore.current?.promotion
    const formatter = priceFormatter('fr-FR', 'EUR')
    return {
      href: `/promotions/get/${promotion.uuid}`,
      type: promotion.type === ReductionType.Fixed ? 'FIXE' : 'POURCENTAGE',
      amount: formatter.format(promotion.amount / 100),
      startDate: promotion.startDate
        ? timestampToLocaleString(promotion.startDate, 'fr-FR')
        : '',
      startDatetime: new Date(promotion.startDate || ''),
      endDate: promotion.endDate
        ? timestampToLocaleString(promotion.endDate, 'fr-FR')
        : '',
      endDatetime: new Date(promotion.endDate || '')
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const productFormEditVM = (key: string) => {
  const uuidGenerator = new RealUuidGenerator()
  const initializer = new ExistingProductFormInitializer(key, uuidGenerator)
  const getter = new ProductFormFieldsReader(key)
  const setter = new ProductFormFieldsWriter(key, getter)
  return new ProductFormEditVM(initializer, getter, setter, uuidGenerator)
}
