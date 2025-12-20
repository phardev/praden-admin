import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { UUID } from '@core/types/types'
import { useFormStore } from '@store/formStore'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'
import { Field } from '../../promotions/promotion-form/promotionFormCreateVM'
import { PromotionCodeFormFieldsReader } from './promotionCodeFormGetVM'
import { PromotionCodeFormVM } from './promotionCodeFormVM'

export class PromotionCodeFormFieldsWriter extends FormFieldsWriter {
  protected fieldsReader: PromotionCodeFormFieldsReader
  private readonly fieldHandlers: Record<string, FieldHandler>

  constructor(key: string, fieldsReader: PromotionCodeFormFieldsReader) {
    super(key)
    this.fieldsReader = fieldsReader
    this.fieldHandlers = {
      reductionType: this.setReductionType.bind(this)
    }
  }

  override set(fieldName: string, value: any): void {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    handler(value)
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

  private setReductionType(type: ReductionType): void {
    this.set('amount', undefined)
    super.set('reductionType', type)
  }
}

export class NewPromotionCodeFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init() {
    this.formStore.set(this.key, {
      scope: PromotionScope.Products,
      reductionType: ReductionType.Fixed,
      code: '',
      amount: undefined,
      startDate: undefined,
      endDate: undefined,
      maximumUsage: undefined,
      minimumAmount: undefined,
      deliveryMethodUuid: undefined,
      products: []
    })
  }
}

export class PromotionCodeFormCreateVM extends PromotionCodeFormVM {
  protected readonly key: string
  protected formStore: any
  private fieldsWriter: PromotionCodeFormFieldsWriter

  constructor(
    initializer: NewPromotionCodeFormInitializer,
    fieldsReader: PromotionCodeFormFieldsReader,
    fieldsWriter: PromotionCodeFormFieldsWriter,
    key: string
  ) {
    super(fieldsReader)
    this.key = key
    initializer.init()
    this.fieldsWriter = fieldsWriter
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
      value: res.map((p: ProductListItem) => {
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

  addProducts(uuids: Array<UUID>) {
    this.fieldsWriter.addProducts(uuids)
  }

  removeProducts(uuids: Array<UUID>) {
    this.fieldsWriter.removeProducts(uuids)
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
}

export const promotionCodeFormCreateVM = (key: string) => {
  const initializer = new NewPromotionCodeFormInitializer(key)
  const reader = new PromotionCodeFormFieldsReader(key)
  const writer = new PromotionCodeFormFieldsWriter(key, reader)
  return new PromotionCodeFormCreateVM(initializer, reader, writer, key)
}
