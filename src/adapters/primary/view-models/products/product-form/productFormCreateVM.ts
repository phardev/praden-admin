import {
  FormInitializer,
  ProductFormFieldsReader,
  ProductFormVM
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { type Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { type Category } from '@core/entities/category'
import { Laboratory } from '@core/entities/laboratory'
import { Location } from '@core/entities/location'
import { ProductStatus } from '@core/entities/product'
import { UUID } from '@core/types/types'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { useFormStore } from '@store/formStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useLocationStore } from '@store/locationStore'
import { useProductStore } from '@store/productStore'
import { getFileContent } from '@utils/file'
import { addTaxToPrice, removeTaxFromPrice } from '@utils/price'

export type CreateProductCategoriesVM = Array<Pick<Category, 'uuid' | 'name'>>
export type CreateProductLocationsVM = Array<Pick<Location, 'uuid' | 'name'>>
export type CreateProductLaboratoriesVM = Array<
  Pick<Laboratory, 'uuid' | 'name'>
>

export type FieldHandler = (value: any) => void | Promise<void>

export class FormFieldsWriter {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  set(fieldName: string, value: any): void {
    this.formStore.set(this.key, { [fieldName]: value })
  }
}

export class ProductFormFieldsWriter extends FormFieldsWriter {
  protected fieldsReader: ProductFormFieldsReader
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string, fieldsReader: ProductFormFieldsReader) {
    super(key)
    this.fieldsReader = fieldsReader

    this.fieldHandlers = {
      priceWithoutTax: this.setPriceWithoutTax.bind(this),
      percentTaxRate: this.setPercentTaxRate.bind(this),
      priceWithTax: this.setPriceWithTax.bind(this),
      miniature: this.setMiniature.bind(this),
      newImages: this.setNewImages.bind(this),
      locations: this.setLocations.bind(this)
    }
  }

  override async set(fieldName: string, value: any): Promise<any> {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    await handler(value)
  }

  private setPriceWithoutTax(priceWithoutTax: string | undefined): void {
    super.set('priceWithoutTax', priceWithoutTax)
    const taxRate = this.fieldsReader.get('percentTaxRate')
    if (taxRate && priceWithoutTax) {
      const newPriceWithTax = addTaxToPrice(+priceWithoutTax, taxRate).toFixed(
        2
      )
      if (newPriceWithTax !== this.fieldsReader.get('priceWithTax')) {
        super.set('priceWithTax', newPriceWithTax)
      }
    } else {
      super.set('priceWithTax', undefined)
    }
  }

  private setPercentTaxRate(percentTaxRate: string | undefined): void {
    super.set('percentTaxRate', percentTaxRate)
    const priceWithoutTax = this.fieldsReader.get('priceWithoutTax')
    const priceWithTax = this.fieldsReader.get('priceWithTax')
    if (priceWithTax && percentTaxRate && !priceWithoutTax) {
      const newPriceWithoutTax = removeTaxFromPrice(
        +priceWithTax,
        +percentTaxRate
      ).toFixed(2)
      if (newPriceWithoutTax !== this.fieldsReader.get('priceWithoutTax')) {
        this.formStore.set(this.key, { priceWithoutTax: newPriceWithoutTax })
      }
    } else if (priceWithoutTax && percentTaxRate) {
      const newPriceWithTax = addTaxToPrice(
        +priceWithoutTax,
        +percentTaxRate
      ).toFixed(2)
      if (newPriceWithTax !== this.fieldsReader.get('priceWithTax')) {
        super.set('priceWithTax', newPriceWithTax)
      }
    }
  }

  private setPriceWithTax(priceWithTax: string | undefined): void {
    super.set('priceWithTax', priceWithTax)
    const taxRate = this.fieldsReader.get('percentTaxRate')
    if (taxRate && priceWithTax) {
      const newPriceWithoutTax = removeTaxFromPrice(
        +priceWithTax,
        taxRate
      ).toFixed(2)
      if (newPriceWithoutTax !== this.fieldsReader.get('priceWithoutTax')) {
        super.set('priceWithoutTax', newPriceWithoutTax)
      }
    }
  }

  async setMiniature(miniature: File): Promise<void> {
    const data = await getFileContent(miniature)
    super.set('miniature', data)
    super.set('newMiniature', miniature)
  }

  async setNewImages(newImages: Array<File>): Promise<void> {
    super.set('newImages', newImages)
    const images = this.fieldsReader.get('images')
    for (const image of newImages) {
      const content = await getFileContent(image)
      images.push(content)
    }
    super.set('images', images)
  }

  setLocations(location: any): void {
    if (location.uuid) {
      const locations = this.fieldsReader.get('locations')
      locations[location.uuid] = location.value
      super.set('locations', locations)
    }
  }
}

export class NewProductFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  protected productStore: any
  protected locationStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.productStore = useProductStore()
    this.locationStore = useLocationStore()
  }

  init() {
    this.formStore.set(this.key, {
      name: '',
      isActive: true,
      categoryUuids: [],
      cip7: '',
      cip13: '',
      ean13: '',
      priceWithoutTax: undefined,
      percentTaxRate: undefined,
      priceWithTax: undefined,
      laboratory: undefined,
      locations: {},
      availableStock: '',
      newImages: [],
      images: [],
      description: '',
      instructionsForUse: '',
      composition: '',
      weight: '',
      maxQuantityForOrder: '',
      arePromotionsAllowed: true
    })
  }
}

export class ProductFormCreateVM extends ProductFormVM {
  private fieldsReader: ProductFormFieldsReader
  private fieldsWriter: ProductFormFieldsWriter

  constructor(
    initializer: NewProductFormInitializer,
    fieldsReader: ProductFormFieldsReader,
    fieldsWriter: ProductFormFieldsWriter
  ) {
    super()
    initializer.init()
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  async setMiniature(miniature: File): Promise<void> {
    const data = await getFileContent(miniature)
    await this.fieldsWriter.set('miniature', data)
  }

  toggleIsActive(): void {
    const isActive = this.fieldsReader.get('isActive')
    this.fieldsWriter.set('isActive', !isActive)
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

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  async set(fieldName: string, value: any): Promise<void> {
    await this.fieldsWriter.set(fieldName, value)
  }

  async removeImage(data: string) {
    const images = this.fieldsReader.get('images')
    if (images.find((i: string) => i === data)) {
      const updated = images.filter((image: string) => image !== data)
      await this.set('images', updated)
    }
    const newImages = this.fieldsReader.get('newImages')
    const newImagesData = []
    for (const file of newImages) {
      newImagesData.push(await getFileContent(file))
    }
    const index = newImagesData.findIndex((i) => i === data)
    if (index >= 0) {
      newImages.splice(index, 1)
    }
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

  getDto(): CreateProductDTO {
    const priceWithoutTax = this.fieldsReader.get('priceWithoutTax')
      ? parseFloat(this.fieldsReader.get('priceWithoutTax')) * 100
      : 0
    const percentTaxRate = this.fieldsReader.get('percentTaxRate')
      ? parseFloat(this.fieldsReader.get('percentTaxRate'))
      : 0
    const availableStock = this.fieldsReader.get('availableStock')
      ? parseInt(this.fieldsReader.get('availableStock'))
      : 0
    const laboratoryStore = useLaboratoryStore()
    const laboratory = laboratoryStore.getByUuid(
      this.fieldsReader.get('laboratory')
    )
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
      images: this.fieldsReader.get('newImages'),
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

  getPromotion(): undefined {
    return undefined
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const productFormCreateVM = (key: string): ProductFormCreateVM => {
  const initializer = new NewProductFormInitializer(key)
  const getter = new ProductFormFieldsReader(key)
  const setter = new ProductFormFieldsWriter(key, getter)
  return new ProductFormCreateVM(initializer, getter, setter)
}
