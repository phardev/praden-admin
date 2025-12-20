import {
  Field,
  PromotionFormFieldsWriter
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  ExistingPromotionFormInitializer,
  PromotionFormFieldsReader
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormGetVM'
import { PromotionFormVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormVM'
import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'

export class PromotionFormEditVM extends PromotionFormVM {
  protected readonly key: string
  protected formStore: any
  private fieldsWriter: PromotionFormFieldsWriter

  constructor(
    initializer: ExistingPromotionFormInitializer,
    fieldsReader: PromotionFormFieldsReader,
    fieldsWriter: PromotionFormFieldsWriter,
    key: string
  ) {
    super(fieldsReader)
    this.key = key
    initializer.init()
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

  set(fieldName: string, value: any): void {
    this.fieldsWriter.set(fieldName, value)
  }

  getAvailableProducts() {
    const productStore = useProductStore()
    const allProducts = productStore.items
    const searchStore = useSearchStore()
    const filteredProducts: Array<ProductListItem> = searchStore.get(this.key)
    const addedProducts = this.fieldsReader.get('products')
    const res = (filteredProducts || allProducts).filter(
      (p: ProductListItem) =>
        !addedProducts.map((p: ProductListItem) => p.uuid).includes(p.uuid)
    )
    return {
      value: res
        .map((p: ProductListItem) => {
          return {
            uuid: p.uuid,
            name: p.name,
            reference: p.ean13,
            categories: p.categories.map((c) => c.name),
            laboratory: p.laboratory ? p.laboratory.name : ''
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
      canEdit: true
    }
  }

  addProducts(cip13: Array<string>) {
    this.fieldsWriter.addProducts(cip13)
  }

  removeProducts(cip13: Array<string>) {
    this.fieldsWriter.removeProducts(cip13)
  }

  getCanValidate(): boolean {
    if (!this.fieldsReader.get('name').length) return false
    if (!this.fieldsReader.get('amount')) return false
    if (!this.fieldsReader.get('products').length) return false
    return true
  }

  getDto(): CreatePromotionDTO {
    let amount = this.fieldsReader.get('amount')
    const type = this.fieldsReader.get('type')
    if (type === ReductionType.Fixed) {
      amount *= 100
    }
    return {
      name: this.fieldsReader.get('name'),
      products: this.fieldsReader.get('products'),
      type,
      amount,
      startDate: this.fieldsReader.get('startDate'),
      endDate: this.fieldsReader.get('endDate')
    }
  }

  getDisplayValidate(): boolean {
    return true
  }
}

export const promotionFormEditVM = (key: string): PromotionFormEditVM => {
  const initializer = new ExistingPromotionFormInitializer(key)
  const reader = new PromotionFormFieldsReader(key)
  const writer = new PromotionFormFieldsWriter(key, reader)
  return new PromotionFormEditVM(initializer, reader, writer, key)
}
