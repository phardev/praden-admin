import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import {
  ExistingPromotionFormInitializer,
  PromotionFormFieldsReader
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormGetVM'
import { PromotionFormVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormVM'
import {
  Field,
  PromotionFormFieldsWriter
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'

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
    const allProducts: Array<Product> = productStore.items
    const searchStore = useSearchStore()
    const filteredProducts: Array<Product> = searchStore.get(this.key)
    const addedProducts = this.fieldsReader.get('products')
    const res = (filteredProducts || allProducts).filter(
      (p) => !addedProducts.map((p) => p.uuid).includes(p.uuid)
    )
    return {
      value: res.map((p: Product) => {
        return {
          uuid: p.uuid,
          name: p.name,
          reference: p.cip13,
          category: p.category ? p.category.name : '',
          laboratory: p.laboratory
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
      productUuids: this.fieldsReader.get('products').map((p) => p.uuid),
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

export const promotionFormEditVM = (key: string) => {
  const initializer = new ExistingPromotionFormInitializer(key)
  const reader = new PromotionFormFieldsReader(key)
  const writer = new PromotionFormFieldsWriter(key, reader)
  return new PromotionFormEditVM(initializer, reader, writer, key)
}
