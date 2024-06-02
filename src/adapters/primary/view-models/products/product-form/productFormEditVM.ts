import {
  ExistingProductFormInitializer,
  ProductFormFieldsReader
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import {
  CreateProductCategoriesVM,
  ProductFormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'

export class ProductFormEditVM {
  private fieldsReader: ProductFormFieldsReader
  private fieldsWriter: ProductFormFieldsWriter

  constructor(
    initializer: ExistingProductFormInitializer,
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

  getDto(): EditProductDTO {
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
      location: this.fieldsReader.get('location'),
      availableStock: this.fieldsReader.get('availableStock'),
      description: this.fieldsReader.get('description'),
      instructionsForUse: this.fieldsReader.get('instructionsForUse'),
      composition: this.fieldsReader.get('composition')
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
  const initializer = new ExistingProductFormInitializer(key)
  const getter = new ProductFormFieldsReader(key)
  const setter = new ProductFormFieldsWriter(key, getter)
  return new ProductFormEditVM(initializer, getter, setter)
}
