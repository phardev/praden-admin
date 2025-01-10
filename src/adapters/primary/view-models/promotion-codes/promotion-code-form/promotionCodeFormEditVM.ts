import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { PromotionCodeFormVM } from './promotionCodeFormVM'
import {
  ExistingPromotionCodeFormInitializer,
  PromotionCodeFormFieldsReader
} from './promotionCodeFormGetVM'
import { PromotionCodeFormFieldsWriter } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormCreateVM'

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

  getDisplayValidate(): boolean {
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
