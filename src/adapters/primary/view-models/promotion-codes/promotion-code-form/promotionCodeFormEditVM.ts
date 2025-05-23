import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { PromotionCodeFormVM } from './promotionCodeFormVM'
import {
  ExistingPromotionCodeFormInitializer,
  PromotionCodeFormFieldsReader
} from './promotionCodeFormGetVM'
import { PromotionCodeFormFieldsWriter } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormCreateVM'
import { useProductStore } from '@store/productStore'
import { Product } from '@core/entities/product'
import { useSearchStore } from '@store/searchStore'

export class PromotionCodeFormEditVM extends PromotionCodeFormVM {
  protected readonly key: string
  protected formStore: any
  private fieldsWriter: PromotionCodeFormFieldsWriter

  constructor(
    initializer: ExistingPromotionCodeFormInitializer,
    fieldReader: PromotionCodeFormFieldsReader,
    fieldWriter: PromotionCodeFormFieldsWriter,
    key: string
  ) {
    super(fieldReader)
    this.key = key
    initializer.init()
    this.fieldsWriter = fieldWriter
  }

  getAvailableProducts() {
    const productStore = useProductStore()
    const allProducts: Array<Product> = productStore.items
    const searchStore = useSearchStore()
    const filteredProducts: Array<Product> = searchStore.get(this.key)
    const addedProducts = this.fieldsReader.get('products')
    const res = (filteredProducts || allProducts).filter(
      (p: Product) =>
        !addedProducts.map((p: Product) => p.uuid).includes(p.uuid)
    )
    return {
      value: res.map((p: Product) => {
        return {
          uuid: p.uuid,
          name: p.name,
          reference: p.ean13,
          categories: p.categories.map((c) => c.name),
          laboratory: p.laboratory ? p.laboratory.name : ''
        }
      }),
      canEdit: true
    }
  }

  addProducts(cip13: Array<string>) {
    this.fieldsWriter.addProducts(cip13)
  }

  removeProducts(cip13: Array<string>) {
    this.fieldsWriter.removeProducts(cip13)
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

  set(fieldName: string, value: any): void {
    this.fieldsWriter.set(fieldName, value)
  }

  override getDisplayValidate(): boolean {
    return true
  }
}

export const promotionCodeFormEditVM = (
  key: string
): PromotionCodeFormEditVM => {
  const initializer = new ExistingPromotionCodeFormInitializer(key)
  const reader = new PromotionCodeFormFieldsReader(key)
  const writer = new PromotionCodeFormFieldsWriter(key, reader)
  return new PromotionCodeFormEditVM(initializer, reader, writer, key)
}
