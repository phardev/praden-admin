import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { PromotionFormFieldsReader } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormGetVM'
import { PromotionFormVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormVM'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import { UUID } from '@core/types/types'
import { useFormStore } from '@store/formStore'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'

export interface TypeChoiceVM {
  type: ReductionType
  text: string
}

export interface PromotionProductItemVM {
  uuid: UUID
  name: string
  reference: string
  categories: Array<string>
  laboratory: string
}

export interface Field<T> {
  value: T
  canEdit: boolean
}

export class PromotionFormFieldsWriter extends FormFieldsWriter {
  protected fieldsReader: PromotionFormFieldsReader
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string, fieldsReader: PromotionFormFieldsReader) {
    super(key)
    this.fieldsReader = fieldsReader
    this.fieldHandlers = {
      type: this.setType.bind(this)
    }
  }

  override set(fieldName: string, value: any): void {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    handler(value)
  }

  private setType(type: ReductionType): void {
    this.set('amount', undefined)
    super.set('type', type)
  }

  addProducts(uuids: Array<UUID>) {
    const products = this.fieldsReader.get('products')
    const productStore = useProductStore()
    const searchStore = useSearchStore()
    const searchResult = searchStore.get(this.key)
    const alreadyAdded = products.map((p: ProductListItem) => p.uuid)
    uuids
      .filter((uuid) => !alreadyAdded.includes(uuid))
      .forEach((uuid) => {
        let product = productStore.getByUuid(uuid)
        if (!product) {
          product = searchResult.find((p) => p.uuid === uuid)
        }
        products.push(product)
      })
    super.set('products', products)
  }

  removeProducts(uuids: Array<UUID>) {
    let products = this.fieldsReader.get('products')
    products = products.filter((p: ProductListItem) => !uuids.includes(p.uuid))
    super.set('products', products)
  }
}

export class NewPromotionFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init() {
    this.formStore.set(this.key, {
      name: '',
      type: ReductionType.Fixed,
      products: [],
      startDate: undefined,
      endDate: undefined,
      amount: undefined
    })
  }
}

export class PromotionFormCreateVM extends PromotionFormVM {
  protected readonly key: string
  protected formStore: any
  private fieldsWriter: PromotionFormFieldsWriter

  constructor(
    initializer: NewPromotionFormInitializer,
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

  addProducts(uuids: Array<UUID>) {
    this.fieldsWriter.addProducts(uuids)
  }

  removeProducts(uuids: Array<UUID>) {
    this.fieldsWriter.removeProducts(uuids)
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
    const res: CreatePromotionDTO = {
      name: this.fieldsReader.get('name'),
      products: this.fieldsReader.get('products'),
      type,
      amount
    }
    const startDate = this.fieldsReader.get('startDate')
    if (startDate) {
      res.startDate = startDate
    }
    const endDate = this.fieldsReader.get('endDate')
    if (endDate) {
      res.endDate = endDate
    }
    return res
  }

  getDisplayValidate(): boolean {
    return true
  }
}

export const promotionFormCreateVM = (key: string) => {
  const initializer = new NewPromotionFormInitializer(key)
  const reader = new PromotionFormFieldsReader(key)
  const writer = new PromotionFormFieldsWriter(key, reader)
  return new PromotionFormCreateVM(initializer, reader, writer, key)
}
