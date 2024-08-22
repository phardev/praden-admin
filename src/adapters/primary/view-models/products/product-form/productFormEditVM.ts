import {
  ExistingProductFormInitializer,
  GetProductPromotionVM,
  ProductFormFieldsReader
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import {
  CreateProductCategoriesVM,
  CreateProductLocationsVM,
  ProductFormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { useProductStore } from '@store/productStore'

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

  getAvailableLocations(): CreateProductLocationsVM {
    return this.fieldsReader.getAvailableLocations()
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
    return {
      name: this.fieldsReader.get('name'),
      cip7: this.fieldsReader.get('cip7'),
      cip13: this.fieldsReader.get('cip13'),
      ean13: this.fieldsReader.get('ean13'),
      categoryUuid: this.fieldsReader.get('categoryUuid'),
      laboratory: this.fieldsReader.get('laboratory'),
      images: this.fieldsReader.get('images'),
      newImages: this.fieldsReader.get('newImages'),
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
        : undefined
    }
  }

  getPromotion(): GetProductPromotionVM | undefined {
    const productStore = useProductStore()
    return productStore.current?.promotion
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
