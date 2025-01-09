import { ReductionType } from '@core/entities/promotion'
import { useFormStore } from '@store/formStore'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import {
  FieldHandler,
  FormFieldsWriter
} from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { PromotionCodeFormFieldsReader } from './promotionCodeFormGetVM'
import { PromotionCodeFormVM } from './promotionCodeFormVM'
import { Field } from '../../promotions/promotion-form/promotionFormCreateVM'
import {
  CreatePromotionCodeDTO,
  PromotionScope
} from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'

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

  set(fieldName: string, value: any): void {
    const handler =
      this.fieldHandlers[fieldName] || super.set.bind(this, fieldName)
    handler(value)
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
      reductionType: ReductionType.Fixed
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

  getCanValidate(): boolean {
    const code = this.fieldsReader.get('code')
    if (!code || !code.length) return false
    if (!this.fieldsReader.get('amount')) return false
    return true
  }

  getDto(): CreatePromotionCodeDTO {
    let amount = +this.fieldsReader.get('amount')
    const reductionType = this.fieldsReader.get('reductionType')
    if (reductionType === ReductionType.Fixed) {
      amount *= 100
    }
    const res: CreatePromotionCodeDTO = {
      code: this.fieldsReader.get('code'),
      scope: this.fieldsReader.get('scope'),
      reductionType,
      amount,
      conditions: {}
    }
    const startDate = this.fieldsReader.get('startDate')
    if (startDate) {
      res.startDate = startDate
    }
    const endDate = this.fieldsReader.get('endDate')
    if (endDate) {
      res.endDate = endDate
    }
    const maximumUsage = this.fieldsReader.get('maximumUsage')
    if (maximumUsage) {
      res.conditions.maximumUsage = +maximumUsage
    }
    const minimumAmount = this.fieldsReader.get('minimumAmount')
    if (minimumAmount) {
      res.conditions.minimumAmount = +minimumAmount
    }
    const deliveryMethodUuid = this.fieldsReader.get('deliveryMethodUuid')
    if (deliveryMethodUuid) {
      res.conditions.deliveryMethodUuid = deliveryMethodUuid
    }
    return res
  }

  getDisplayValidate(): boolean {
    return true
  }
}

export const promotionCodeFormCreateVM = (key: string) => {
  const initializer = new NewPromotionCodeFormInitializer(key)
  const reader = new PromotionCodeFormFieldsReader(key)
  const writer = new PromotionCodeFormFieldsWriter(key, reader)
  return new PromotionCodeFormCreateVM(initializer, reader, writer, key)
}
