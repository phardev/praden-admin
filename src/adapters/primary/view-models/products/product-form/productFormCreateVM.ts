import { useFormStore } from '@store/formStore'
import { type Category } from '@core/entities/category'
import { type Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { getFileContent } from '@utils/file'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { addTaxToPrice, removeTaxFromPrice } from '@utils/price'
import { useProductStore } from '@store/productStore'
import {
  FormInitializer,
  ProductFormFieldsReader
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useLocationStore } from '@store/locationStore'
import { Location } from '@core/entities/location'

export type CreateProductCategoriesVM = Array<Pick<Category, 'uuid' | 'name'>>
export type CreateProductLocationsVM = Array<Pick<Location, 'uuid' | 'name'>>

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
      newImages: this.setNewImages.bind(this),
      locations: this.setLocations.bind(this)
    }
  }

  async set(fieldName: string, value: any): Promise<any> {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    await handler(value)
  }

  private setPriceWithoutTax(priceWithoutTax: string | undefined): void {
    super.set('priceWithoutTax', priceWithoutTax)
    const taxRate = this.fieldsReader.get('percentTaxRate')
    if (taxRate) {
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
    if (priceWithTax && !priceWithoutTax) {
      const newPriceWithoutTax = removeTaxFromPrice(
        +priceWithTax,
        +percentTaxRate
      ).toFixed(2)
      if (newPriceWithoutTax !== this.fieldsReader.get('priceWithoutTax')) {
        this.formStore.set(this.key, { priceWithoutTax: newPriceWithoutTax })
      }
    } else if (priceWithoutTax) {
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
    if (taxRate) {
      const newPriceWithoutTax = removeTaxFromPrice(
        +priceWithTax,
        taxRate
      ).toFixed(2)
      if (newPriceWithoutTax !== this.fieldsReader.get('priceWithoutTax')) {
        super.set('priceWithoutTax', newPriceWithoutTax)
      }
    }
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
      categoryUuid: undefined,
      cip7: '',
      cip13: '',
      ean13: '',
      priceWithoutTax: undefined,
      percentTaxRate: undefined,
      priceWithTax: undefined,
      laboratory: '',
      locations: {},
      availableStock: '',
      newImages: [],
      images: [],
      description: '',
      instructionsForUse: '',
      composition: '',
      weight: ''
    })
  }
}

export class ProductFormCreateVM {
  private fieldsReader: ProductFormFieldsReader
  private fieldsWriter: ProductFormFieldsWriter

  constructor(
    initializer: NewProductFormInitializer,
    fieldsReader: ProductFormFieldsReader,
    fieldsWriter: ProductFormFieldsWriter
  ) {
    initializer.init()
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
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

  getAvailableCategories(): CreateProductCategoriesVM {
    return this.fieldsReader.getAvailableCategories()
  }

  getAvailableLocations(): CreateProductLocationsVM {
    return this.fieldsReader.getAvailableLocations()
  }

  getDto(): CreateProductDTO {
    return {
      name: this.fieldsReader.get('name'),
      cip7: this.fieldsReader.get('cip7'),
      cip13: this.fieldsReader.get('cip13'),
      ean13: this.fieldsReader.get('ean13'),
      categoryUuid: this.fieldsReader.get('categoryUuid'),
      laboratory: this.fieldsReader.get('laboratory'),
      images: this.fieldsReader.get('newImages'),
      priceWithoutTax: this.fieldsReader.get('priceWithoutTax'),
      percentTaxRate: this.fieldsReader.get('percentTaxRate').toString(),
      locations: this.fieldsReader.get('locations'),
      availableStock: this.fieldsReader.get('availableStock'),
      description: this.fieldsReader.get('description'),
      instructionsForUse: this.fieldsReader.get('instructionsForUse'),
      composition: this.fieldsReader.get('composition'),
      weight: +this.fieldsReader.get('weight') * 1000
    }
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
