import { useFormStore } from '@store/formStore'
import { ReductionType } from '@core/entities/promotion'
import {
  Field,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import {
  PromotionCodeFormVM,
  PromotionCodeProductItemVM
} from './promotionCodeFormVM'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import { PromotionScope } from '@core/entities/promotionCode'
import { UUID } from '@core/types/types'

export interface PromotionScopeChoiceVM {
  scope: PromotionScope
  text: string
}

export type AvailableDeliveryMethodsVM = Array<{ uuid: UUID; name: string }>

export class ExistingPromotionCodeFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  protected promotionCodeStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.promotionCodeStore = usePromotionCodeStore()
  }

  init() {
    let promotionCode = this.promotionCodeStore.current
    if (promotionCode) {
      promotionCode = JSON.parse(JSON.stringify(promotionCode))
    }
    this.formStore.set(this.key, {
      code: promotionCode ? promotionCode.code : '',
      reductionType: promotionCode
        ? promotionCode.reductionType
        : ReductionType.Fixed,
      scope: promotionCode ? promotionCode.scope : PromotionScope.Products,
      startDate: promotionCode ? promotionCode.startDate : undefined,
      endDate: promotionCode ? promotionCode.endDate : undefined,
      amount: promotionCode
        ? promotionCode.reductionType === ReductionType.Fixed
          ? (promotionCode.amount / 100).toString()
          : promotionCode.amount.toString()
        : undefined,
      maximumUsage: promotionCode.conditions.maximumUsage,
      minimumAmount: promotionCode.conditions.minimumAmount
        ? (promotionCode.conditions.minimumAmount / 100).toString()
        : undefined,
      deliveryMethodUuid: promotionCode.conditions.deliveryMethodUuid,
      products:
        promotionCode && promotionCode.conditions.products
          ? promotionCode.conditions.products
          : []
    })
  }
}

export class PromotionCodeFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
  }

  getAvailableTypeChoices(): Array<TypeChoiceVM> {
    return Object.values(ReductionType).map((type) => {
      const text = this.getTypeText(type)
      return {
        type,
        text
      }
    })
  }

  private getTypeText(type: ReductionType): string {
    if (type === ReductionType.Percentage) {
      return 'Pourcentage'
    }
    return 'Euros'
  }
}

export class PromotionCodeFormGetVM extends PromotionCodeFormVM {
  protected readonly key: string
  protected formStore: any

  constructor(
    initializer: ExistingPromotionCodeFormInitializer,
    fieldReader: PromotionCodeFormFieldsReader
  ) {
    super(fieldReader)
    initializer.init()
  }

  getAvailableProducts(): Field<Array<PromotionProductItemVM>> {
    return {
      value: [],
      canEdit: false
    }
  }

  getProducts(): Field<Array<PromotionCodeProductItemVM>> {
    return {
      ...super.getProducts(),
      canEdit: false
    }
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: false
    }
  }

  getCanValidate(): boolean {
    return false
  }

  getDisplayValidate(): boolean {
    return false
  }
}

export const promotionCodeFormGetVM = (key: string): PromotionCodeFormGetVM => {
  const initializer = new ExistingPromotionCodeFormInitializer(key)
  const reader = new PromotionCodeFormFieldsReader(key)
  return new PromotionCodeFormGetVM(initializer, reader)
}
