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
import {
  getProductFormValidationErrors,
  ProductFormValidationError
} from '@adapters/primary/view-models/products/product-form/productFormValidation'
import { ProductImagesEditor } from '@adapters/primary/view-models/products/product-form/productImagesEditor'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { RealUuidGenerator } from '@adapters/secondary/uuid-generators/RealUuidGenerator'
import { ProductStatus, StockManagementMode } from '@core/entities/product'
import { type ProductImage } from '@core/entities/productImage'
import { ReductionType } from '@core/entities/promotion'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useProductStore } from '@store/productStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { parseDecimal } from '@utils/number'

const parseOptionalInteger = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  const parsed = parseInt(String(value))
  return Number.isNaN(parsed) ? undefined : parsed
}

export class ProductFormEditVM extends ProductFormVM {
  private fieldsReader: ProductFormFieldsReader
  private fieldsWriter: ProductFormFieldsWriter
  private imagesEditor: ProductImagesEditor

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
    this.imagesEditor = new ProductImagesEditor(
      fieldsReader,
      fieldsWriter,
      uuidGenerator
    )
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
    this.imagesEditor.removeById(imageId)
  }

  reorderImages(fromIndex: number, toIndex: number): void {
    this.imagesEditor.reorder(fromIndex, toIndex)
  }

  async addImages(files: Array<File>): Promise<void> {
    await this.imagesEditor.add(files)
  }

  getProductImagesForDisplay(): Array<{ id: string; url: string }> {
    return this.imagesEditor.forDisplay()
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
      ? parseDecimal(this.fieldsReader.get('priceWithoutTax')) * 100
      : undefined
    const percentTaxRate = this.fieldsReader.get('percentTaxRate')
      ? parseDecimal(this.fieldsReader.get('percentTaxRate'))
      : undefined
    const availableStock = parseOptionalInteger(
      this.fieldsReader.get('availableStock')
    )
    const laboratoryStore = useLaboratoryStore()
    const laboratory = laboratoryStore.getByUuid(
      this.fieldsReader.get('laboratory')
    )
    const orderedImages: Array<ProductImage> = this.imagesEditor.ordered()
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
      minStockToSell: parseOptionalInteger(
        this.fieldsReader.get('minStockToSell')
      ),
      stockManagementMode: this.fieldsReader.get('stockManagementMode') as
        | StockManagementMode
        | undefined,
      description: this.fieldsReader.get('description'),
      instructionsForUse: this.fieldsReader.get('instructionsForUse'),
      composition: this.fieldsReader.get('composition'),
      weight: parseDecimal(this.fieldsReader.get('weight')) * 1000,
      maxQuantityForOrder: parseOptionalInteger(
        this.fieldsReader.get('maxQuantityForOrder')
      ),
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

  getValidationErrors(): Array<ProductFormValidationError> {
    return getProductFormValidationErrors(this.fieldsReader)
  }

  getCanValidate(): boolean {
    return this.getValidationErrors().length === 0
  }
}

export const productFormEditVM = (key: string) => {
  const uuidGenerator = new RealUuidGenerator()
  const initializer = new ExistingProductFormInitializer(key, uuidGenerator)
  const getter = new ProductFormFieldsReader(key)
  const setter = new ProductFormFieldsWriter(key, getter)
  return new ProductFormEditVM(initializer, getter, setter, uuidGenerator)
}
